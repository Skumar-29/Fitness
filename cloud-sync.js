const config = window.FITNESS_FIREBASE_CONFIG || {};
const configured = Boolean(config.apiKey && config.projectId && !String(config.apiKey).includes('PASTE_') && !String(config.projectId).includes('PASTE_'));
const $ = id => document.getElementById(id);
let auth = null;
let db = null;
let user = null;
let sdk = null;
let unsubscribers = [];
let pushTimer = null;
let pullTimer = null;
let syncing = false;
let lastSyncAt = '';

function isHindi(){ return (window.FitnessV4Voice?.getPrefs?.().language || document.documentElement.lang) === 'hi'; }
function text(en,hi){ return isHindi()?hi:en; }
function showToast(message){ window.FitnessV4API?.showToast?.(message); }
function setStatus(kind,message){
  const badge=$('cloudSyncBadge'), body=$('cloudSyncMessage');
  if(badge){badge.classList.remove('v4-sync-ok','v4-sync-warn','v4-sync-error');if(kind==='ok')badge.classList.add('v4-sync-ok');if(kind==='warn')badge.classList.add('v4-sync-warn');if(kind==='error')badge.classList.add('v4-sync-error');badge.textContent=message;}
  if(body){
    if(kind==='ok')body.textContent=text('Your progress is private and automatically synchronised across signed-in devices.','आपकी प्रगति निजी है और साइन-इन किए गए उपकरणों में अपने आप सिंक होती है।');
    else if(kind==='warn'&&!navigator.onLine)body.textContent=text('Changes are saved on this device and will sync when internet returns.','बदलाव इस डिवाइस पर सुरक्षित हैं और इंटरनेट आने पर सिंक होंगे।');
  }
  const last=$('cloudLastSync'); if(last)last.textContent=lastSyncAt?text(`Last synced ${new Date(lastSyncAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`,`अंतिम सिंक ${new Date(lastSyncAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`):text('Not synced yet','अभी सिंक नहीं हुआ');
}
function updateAccountUI(){
  $('cloudSignedOut')?.classList.toggle('hidden',Boolean(user));
  $('cloudSignedIn')?.classList.toggle('hidden',!user);
  if(user){
    if($('cloudUserName'))$('cloudUserName').textContent=user.displayName||text('Fitness account','फिटनेस खाता');
    if($('cloudUserEmail'))$('cloudUserEmail').textContent=user.email||'';
    setStatus(navigator.onLine?'ok':'warn',navigator.onLine?text('Up to date','सिंक पूरा'):text('Waiting for internet','इंटरनेट की प्रतीक्षा'));
  }else if(configured){setStatus('warn',text('Sign in to sync','सिंक के लिए साइन इन करें'));}
}
function validLocalState(){ return window.FitnessV4API?.getState?.() || null; }
function recordTime(r){ return Date.parse(r?.updatedAt||r?.timestamp||(r?.date?`${r.date}T00:00:00`:''))||0; }
function mergeRecords(local=[],cloud=[]){
  const map=new Map();
  for(const item of [...local,...cloud]){
    if(!item)return;
    const id=item.id||`${item.type||'record'}-${item.date||item.timestamp||Math.random()}`;
    const current=map.get(id);
    if(!current||recordTime(item)>=recordTime(current))map.set(id,{...item,id});
  }
  return [...map.values()].sort((a,b)=>recordTime(a)-recordTime(b));
}
function baseState(state){
  const clone=structuredClone(state||{});
  delete clone.workouts;delete clone.checkins;delete clone.tests;delete clone.activeSession;
  return clone;
}
function chooseNewer(local,cloud){
  if(!cloud)return local;
  if(!local)return cloud;
  return (Date.parse(cloud.updatedAt||'')||0)>(Date.parse(local.updatedAt||'')||0)?cloud:local;
}
function paths(uid){
  return {
    profile:sdk.doc(db,'users',uid,'fitness','profile'),
    prefs:sdk.doc(db,'users',uid,'fitness','preferences'),
    active:sdk.doc(db,'users',uid,'fitness','activeSession'),
    workouts:sdk.collection(db,'users',uid,'workouts'),
    checkins:sdk.collection(db,'users',uid,'checkins'),
    tests:sdk.collection(db,'users',uid,'tests')
  };
}
async function collectionData(ref){ const snap=await sdk.getDocs(ref);return snap.docs.map(d=>({id:d.id,...d.data()})); }
async function fetchCloudBundle(){
  if(!user)return null;
  const p=paths(user.uid);
  const [profile,prefs,active,workouts,checkins,tests]=await Promise.all([
    sdk.getDoc(p.profile),sdk.getDoc(p.prefs),sdk.getDoc(p.active),collectionData(p.workouts),collectionData(p.checkins),collectionData(p.tests)
  ]);
  return {
    base:profile.exists()?profile.data():null,
    prefs:prefs.exists()?prefs.data():null,
    active:active.exists()&&!active.data().cleared?active.data():null,
    workouts,checkins,tests
  };
}
async function pullAndMerge({announce=false}={}){
  if(!user||syncing)return;
  if(!navigator.onLine){setStatus('warn',text('Waiting for internet','इंटरनेट की प्रतीक्षा'));return;}
  syncing=true;setStatus('warn',text('Syncing…','सिंक हो रहा है…'));
  try{
    const local=validLocalState();
    const cloud=await fetchCloudBundle();
    const chosenBase=chooseNewer(baseState(local),cloud?.base||null)||baseState(local);
    const merged={
      ...local,...chosenBase,
      workouts:mergeRecords(local?.workouts,cloud?.workouts),
      checkins:mergeRecords(local?.checkins,cloud?.checkins),
      tests:mergeRecords(local?.tests,cloud?.tests),
      activeSession:chooseNewer(local?.activeSession,cloud?.active)||local?.activeSession||cloud?.active||null,
      schema:5
    };
    window.FitnessV4API?.applyExternalState?.(merged,{source:'cloud'});
    if(cloud?.prefs&&window.FitnessV4Voice?.applyPrefs)window.FitnessV4Voice.applyPrefs(cloud.prefs);
    await pushState(merged,{quiet:true});
    lastSyncAt=new Date().toISOString();setStatus('ok',text('Up to date','सिंक पूरा'));if(announce)showToast(text('Cloud sync complete','क्लाउड सिंक पूरा'));
  }catch(error){console.error(error);setStatus('error',text('Sync problem — retry','सिंक समस्या — फिर प्रयास करें'));if(announce)showToast(text('Cloud sync failed','क्लाउड सिंक विफल'));}
  finally{syncing=false;updateAccountUI();}
}
async function writeRecords(collectionRef,records){
  const valid=(records||[]).filter(r=>r?.id);
  for(let i=0;i<valid.length;i+=400){
    const batch=sdk.writeBatch(db);
    valid.slice(i,i+400).forEach(r=>batch.set(sdk.doc(collectionRef,r.id),{...r,ownerUid:user.uid},{merge:true}));
    await batch.commit();
  }
}
async function pushState(givenState,{quiet=false}={}){
  if(!user)return;
  if(!navigator.onLine){setStatus('warn',text('Waiting for internet','इंटरनेट की प्रतीक्षा'));return;}
  const state=givenState||validLocalState();if(!state)return;
  if(!quiet)setStatus('warn',text('Syncing…','सिंक हो रहा है…'));
  const p=paths(user.uid),batch=sdk.writeBatch(db);
  const base={...baseState(state),ownerUid:user.uid,cloudUpdatedAt:sdk.serverTimestamp()};
  batch.set(p.profile,base,{merge:true});
  const prefs=window.FitnessV4Voice?.getPrefs?.()||{};
  batch.set(p.prefs,{...prefs,ownerUid:user.uid,updatedAt:new Date().toISOString(),cloudUpdatedAt:sdk.serverTimestamp()},{merge:true});
  if(state.activeSession)batch.set(p.active,{...state.activeSession,updatedAt:state.updatedAt||new Date().toISOString(),ownerUid:user.uid,cloudUpdatedAt:sdk.serverTimestamp()},{merge:true});
  else batch.set(p.active,{cleared:true,updatedAt:state.updatedAt||new Date().toISOString(),ownerUid:user.uid,cloudUpdatedAt:sdk.serverTimestamp()},{merge:false});
  await batch.commit();
  await Promise.all([writeRecords(p.workouts,state.workouts),writeRecords(p.checkins,state.checkins),writeRecords(p.tests,state.tests)]);
  lastSyncAt=new Date().toISOString();if(!quiet)setStatus('ok',text('Up to date','सिंक पूरा'));
}
function schedulePush(){
  if(!user)return;
  clearTimeout(pushTimer);
  pushTimer=setTimeout(()=>pushState().catch(error=>{console.error(error);setStatus('error',text('Sync problem — retry','सिंक समस्या — फिर प्रयास करें'));}),1200);
}
function schedulePull(){ clearTimeout(pullTimer);pullTimer=setTimeout(()=>pullAndMerge(),900); }
function startRealtimeListeners(){
  stopRealtimeListeners();if(!user)return;
  const p=paths(user.uid);
  [p.profile,p.prefs,p.active,p.workouts,p.checkins,p.tests].forEach(ref=>{
    const unsub=sdk.onSnapshot(ref,()=>schedulePull(),error=>{console.warn(error);setStatus('error',text('Sync problem — retry','सिंक समस्या — फिर प्रयास करें'));});
    unsubscribers.push(unsub);
  });
}
function stopRealtimeListeners(){unsubscribers.forEach(fn=>{try{fn();}catch{}});unsubscribers=[];}
async function googleSignIn(){
  if(!auth)return;
  const provider=new sdk.GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});
  try{
    if(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent))await sdk.signInWithRedirect(auth,provider);
    else await sdk.signInWithPopup(auth,provider);
  }catch(error){
    if(error?.code==='auth/popup-blocked'||error?.code==='auth/cancelled-popup-request')await sdk.signInWithRedirect(auth,provider);
    else throw error;
  }
}
async function emailSignIn(create=false){
  const email=$('cloudEmail')?.value.trim(),password=$('cloudPassword')?.value||'';
  if(!email||password.length<6){showToast(text('Enter an email and a password of at least 6 characters.','ईमेल और कम से कम 6 अक्षर का पासवर्ड दर्ज करें।'));return;}
  if(create)await sdk.createUserWithEmailAndPassword(auth,email,password);else await sdk.signInWithEmailAndPassword(auth,email,password);
}
async function resetPassword(){const email=$('cloudEmail')?.value.trim();if(!email){showToast(text('Enter your email first.','पहले अपना ईमेल दर्ज करें।'));return;}await sdk.sendPasswordResetEmail(auth,email);showToast(text('Password reset email sent.','पासवर्ड रीसेट ईमेल भेजा गया।'));}
async function deleteCollection(ref){const snap=await sdk.getDocs(ref);for(let i=0;i<snap.docs.length;i+=400){const batch=sdk.writeBatch(db);snap.docs.slice(i,i+400).forEach(d=>batch.delete(d.ref));await batch.commit();}}
async function deleteCloudData(){
  if(!user||!confirm(text('Delete all synced Fitness V5 data from the cloud? Local data on this device will remain.','क्लाउड से सभी सिंक Fitness V5 डेटा हटाएँ? इस डिवाइस का स्थानीय डेटा रहेगा।')))return;
  setStatus('warn',text('Deleting cloud data…','क्लाउड डेटा हटाया जा रहा है…'));
  const p=paths(user.uid);
  await Promise.all([deleteCollection(p.workouts),deleteCollection(p.checkins),deleteCollection(p.tests)]);
  await Promise.all([sdk.deleteDoc(p.profile),sdk.deleteDoc(p.prefs),sdk.deleteDoc(p.active)]);
  lastSyncAt='';setStatus('warn',text('Cloud data deleted','क्लाउड डेटा हटाया गया'));showToast(text('Cloud data deleted; local data remains.','क्लाउड डेटा हटाया गया; स्थानीय डेटा सुरक्षित है।'));
}
async function deleteAccount(){
  if(!user||!confirm(text('Permanently delete this Fitness V5 account and all synced cloud data? Local data on this device will remain until you reset it separately.','इस Fitness V5 खाते और सभी सिंक क्लाउड डेटा को स्थायी रूप से हटाएँ? इस डिवाइस का स्थानीय डेटा अलग से रीसेट करने तक रहेगा।')))return;
  const currentUser=user;
  setStatus('warn',text('Deleting account…','खाता हटाया जा रहा है…'));
  const p=paths(currentUser.uid);
  await Promise.all([deleteCollection(p.workouts),deleteCollection(p.checkins),deleteCollection(p.tests)]);
  await Promise.all([sdk.deleteDoc(p.profile),sdk.deleteDoc(p.prefs),sdk.deleteDoc(p.active)]);
  try{
    await sdk.deleteUser(currentUser);
    lastSyncAt='';showToast(text('Account and cloud data deleted.','खाता और क्लाउड डेटा हटाया गया।'));
  }catch(error){
    if(error?.code==='auth/requires-recent-login'){
      showToast(text('For security, sign out, sign in again, then retry Delete account.','सुरक्षा के लिए साइन आउट करें, फिर से साइन इन करें और खाता हटाएँ दोबारा चुनें।'));
    }
    throw error;
  }
}
function bindUI(){
  $('googleSignInBtn')?.addEventListener('click',()=>googleSignIn().catch(handleAuthError));
  $('emailSignInBtn')?.addEventListener('click',()=>emailSignIn(false).catch(handleAuthError));
  $('emailCreateBtn')?.addEventListener('click',()=>emailSignIn(true).catch(handleAuthError));
  $('emailResetBtn')?.addEventListener('click',()=>resetPassword().catch(handleAuthError));
  $('cloudSignOutBtn')?.addEventListener('click',()=>sdk.signOut(auth).catch(handleAuthError));
  $('syncNowBtn')?.addEventListener('click',()=>pullAndMerge({announce:true}));
  $('deleteCloudBtn')?.addEventListener('click',()=>deleteCloudData().catch(handleAuthError));
  $('deleteAccountBtn')?.addEventListener('click',()=>deleteAccount().catch(handleAuthError));
  window.addEventListener('online',()=>{if(user)pullAndMerge();});
  window.addEventListener('offline',()=>{if(user)setStatus('warn',text('Waiting for internet','इंटरनेट की प्रतीक्षा'));});
  window.addEventListener('fitness-v4-state-saved',event=>{if(event.detail?.source!=='cloud')schedulePush();});
  window.addEventListener('fitness-v4-prefs-saved',schedulePush);
}
function handleAuthError(error){console.error(error);const clean=String(error?.message||error||text('Account action failed.','खाता कार्रवाई विफल।')).replace(/^Firebase:\s*/,'');setStatus('error',text('Account problem','खाता समस्या'));showToast(clean);}
async function boot(){
  if(!configured){setStatus('warn',text('Setup required','सेटअप आवश्यक'));return;}
  try{
    const [appMod,authMod,firestoreMod]=await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js')
    ]);
    sdk={...appMod,...authMod,...firestoreMod};
    const app=sdk.initializeApp(config);
    const appCheckKey=window.FITNESS_APP_CHECK_SITE_KEY||'';
    if(appCheckKey){
      try{
        const appCheckMod=await import('https://www.gstatic.com/firebasejs/12.16.0/firebase-app-check.js');
        appCheckMod.initializeAppCheck(app,{provider:new appCheckMod.ReCaptchaEnterpriseProvider(appCheckKey),isTokenAutoRefreshEnabled:true});
      }catch(error){console.warn('App Check could not start',error);}
    }
    auth=sdk.getAuth(app);
    try{db=sdk.initializeFirestore(app,{localCache:sdk.persistentLocalCache({tabManager:sdk.persistentMultipleTabManager()})});}catch{db=sdk.getFirestore(app);}
    bindUI();
    try{await sdk.getRedirectResult(auth);}catch(error){handleAuthError(error);}
    sdk.onAuthStateChanged(auth,async current=>{
      user=current;updateAccountUI();stopRealtimeListeners();
      if(user){startRealtimeListeners();await pullAndMerge({announce:true});}
    });
    setStatus('warn',text('Sign in to sync','सिंक के लिए साइन इन करें'));
  }catch(error){console.error(error);setStatus('error',text('Cloud module unavailable','क्लाउड मॉड्यूल उपलब्ध नहीं'));}
}

boot();
