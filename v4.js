(() => {
  'use strict';

  const api = () => window.FitnessV4API;
  const $ = id => document.getElementById(id);
  let focusActive = false;
  let lastExerciseName = '';
  let lastStepCounter = '';
  let lastTimerText = '';
  let lastRestAnnouncement = '';

  const equipmentLabel = state => ({none:'No equipment',bands:'Resistance bands',dumbbells:'Dumbbells',mixed:'Bands + dumbbells',gym:'Gym equipment'}[state?.equipment] || 'No equipment');
  const difficultyLabel = state => ({beginner:'Beginner',intermediate:'Intermediate',advanced:'Advanced'}[state?.level] || 'Beginner');

  function isHindi() {
    return (window.FitnessV4Voice?.getPrefs?.().language || document.documentElement.lang) === 'hi';
  }

  function bilingual(en, hi) { return isHindi() ? hi : en; }

  function hindiExerciseSteps(exercise) {
    const item=window.FitnessV4Voice?.getExerciseHindi?.(exercise?.name);
    if(!item?.[1])return [];
    return item[1].split('।').map(x=>x.trim()).filter(Boolean).map(x=>`${x}।`);
  }
  function benefitText(exercise) {
    if(!isHindi())return exercise?.benefit||'';
    const names=(exercise?.muscles||[]).map(m=>window.FitnessV4Voice?.translateMuscle?.(m)||m).join(', ');
    const byCategory={
      strength:`यह ${names} की शक्ति, नियंत्रण और रोज़मर्रा की कार्यक्षमता सुधारता है।`,
      core:`यह ${names} की स्थिरता और शरीर का नियंत्रण सुधारता है।`,
      cardio:`यह स्टैमिना, समन्वय और हृदय-फेफड़ों की क्षमता धीरे-धीरे बढ़ाता है।`,
      warmup:`यह शरीर का तापमान बढ़ाकर जोड़ों और मांसपेशियों को व्यायाम के लिए तैयार करता है।`,
      mobility:`यह आरामदायक गति, लचीलापन और शरीर की स्थिति सुधारता है।`
    };
    return byCategory[exercise?.category]||`यह ${names} के नियंत्रण और फिटनेस में मदद करता है।`;
  }
  function mistakeText(exercise) {
    if(!isHindi())return exercise?.caution||'';
    const byCategory={
      strength:'जल्दी न करें, एड़ियाँ स्थिर रखें और घुटनों या कमर को गलत दिशा में न मोड़ें।',
      core:'साँस न रोकें, कमर को जरूरत से ज्यादा न मोड़ें और तकनीक बिगड़ने से पहले रुकें।',
      cardio:'बहुत तेज़ गति से तकनीक न बिगाड़ें। पैरों को हल्के रखें और जरूरत पर कम प्रभाव वाला विकल्प चुनें।',
      warmup:'दर्द वाली सीमा तक जोर न लगाएँ और गति को झटके से न करें।',
      mobility:'खिंचाव को दर्द तक न ले जाएँ और जोड़ को जबरदस्ती न मोड़ें।'
    };
    return byCategory[exercise?.category]||'गति नियंत्रित रखें और दर्द होने पर रुकें।';
  }

  function breathingText(exercise) {
    if (!exercise) return '';
    if (exercise.category === 'strength' || exercise.category === 'core') {
      return bilingual('Breathe out during the effort and breathe in during the easier return. Do not hold your breath.', 'मेहनत वाले भाग में साँस छोड़ें और आसान वापसी में साँस लें। साँस न रोकें।');
    }
    if (exercise.category === 'cardio') {
      return bilingual('Use a steady rhythm. Slow down before breathing or technique becomes uncontrolled.', 'साँस की लय स्थिर रखें। साँस या तकनीक बिगड़ने से पहले गति कम करें।');
    }
    return bilingual('Breathe slowly and comfortably. Never force a painful range.', 'धीरे और आराम से साँस लें। दर्द वाली सीमा तक जोर न लगाएँ।');
  }

  const musclePoints = {
    'Shoulders': [[50,25]], 'Upper back': [[50,36]], 'Back': [[50,40]], 'Lower back': [[50,49]],
    'Chest': [[50,34]], 'Arms': [[30,38],[70,38]], 'Triceps': [[27,40],[73,40]],
    'Core': [[50,48]], 'Spine': [[50,44]], 'Hips': [[50,59]], 'Glutes': [[50,62]],
    'Thighs': [[42,69],[58,69]], 'Legs': [[42,72],[58,72]], 'Inner thighs': [[47,70],[53,70]],
    'Hamstrings': [[42,72],[58,72]], 'Calves': [[42,86],[58,86]], 'Ankles': [[42,94],[58,94]],
    'Heart': [[47,35]], 'Balance': [[50,56]], 'Breathing': [[50,34]]
  };

  function personSvg(view, muscles) {
    const dots = [];
    for (const m of muscles || []) for (const p of (musclePoints[m] || [])) dots.push(p);
    const unique = [...new Map(dots.map(p => [p.join(','), p])).values()];
    return `<div class="v4-muscle-person"><svg viewBox="0 0 100 110" role="img" aria-label="${view} target muscle diagram">
      <g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".5">
        <circle cx="50" cy="11" r="8"/><path d="M50 20V58M50 29L31 47M50 29L69 47M50 58L39 98M50 58L61 98"/>
      </g>
      ${unique.map(([x,y]) => `<circle cx="${view==='Back' ? 100-x : x}" cy="${y}" r="6.5" fill="#d7352c" opacity=".92"/>`).join('')}
    </svg><small>${view}<br>${(muscles || []).slice(0,3).join(', ') || bilingual('Full body','पूरा शरीर')}</small></div>`;
  }

  function updateInstructionPanel() {
    const A = api(); if (!A) return;
    const id = A.getCurrentExerciseId();
    const stepInfo = A.getCurrentStep();
    const exercise = id ? A.getExercise(id) : null;
    const state = A.getState();
    if (!exercise) {
      $('v4HowTo').innerHTML = `<li>${bilingual('Walk gently, sip water and prepare for the next circuit.','धीरे चलें, पानी पिएँ और अगले सर्किट के लिए तैयार हों।')}</li>`;
      $('v4Breathing').textContent = bilingual('Slow nasal breathing with a relaxed exhale.','नाक से धीरे साँस लें और आराम से छोड़ें।');
      $('v4Mistakes').textContent = bilingual('Do not rush the rest period or begin before you feel ready.','आराम को जल्दी खत्म न करें और तैयार होने से पहले शुरू न करें।');
      $('v4Benefit').textContent = bilingual('Allows breathing and technique to recover before the next circuit.','अगले सर्किट से पहले साँस और तकनीक को ठीक होने देता है।');
      $('v4Reps').textContent = bilingual(`${stepInfo.remaining || 0} sec recovery`,`${stepInfo.remaining || 0} सेकंड आराम`);
      $('v4Equipment').textContent = bilingual('Water','पानी');
      $('v4Difficulty').textContent = bilingual('Recovery','रिकवरी');
      $('v4MiniMuscleMap').innerHTML = personSvg(bilingual('Front','सामने'),[]) + personSvg(bilingual('Back','पीछे'),[]);
      updateNextPreview(stepInfo.next);
      return;
    }
    const writtenSteps=isHindi()?hindiExerciseSteps(exercise):exercise.steps;
    $('v4HowTo').innerHTML = writtenSteps.map(s => `<li>${escapeHtml(s)}</li>`).join('');
    $('v4Breathing').textContent = breathingText(exercise);
    $('v4Mistakes').textContent = mistakeText(exercise);
    $('v4Benefit').textContent = benefitText(exercise);
    $('v4Reps').textContent = stepInfo.step?.mode === 'continuous' ? bilingual(`${stepInfo.step.duration} sec controlled`,`${stepInfo.step.duration} सेकंड नियंत्रित`) : bilingual(`${Math.max(0,60-restSecondsFor(state.level))} sec work`,`${Math.max(0,60-restSecondsFor(state.level))} सेकंड व्यायाम`);
    $('v4Equipment').textContent = isHindi()?({none:'बिना उपकरण',bands:'रेज़िस्टेंस बैंड',dumbbells:'डम्बल',mixed:'बैंड + डम्बल',gym:'जिम उपकरण'}[state?.equipment]||'बिना उपकरण'):equipmentLabel(state);
    $('v4Difficulty').textContent = isHindi()?({beginner:'शुरुआती',intermediate:'मध्यम',advanced:'उन्नत'}[state?.level]||'शुरुआती'):difficultyLabel(state);
    $('v4MiniMuscleMap').innerHTML = personSvg(bilingual('Front','सामने'),exercise.muscles) + personSvg(bilingual('Back','पीछे'),exercise.muscles);
    updateNextPreview(stepInfo.next);
    lastExerciseName = $('exerciseName')?.textContent || id;
  }

  function restSecondsFor(level) { return level === 'advanced' ? 10 : level === 'intermediate' ? 15 : 25; }
  function escapeHtml(s) { return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }

  function updateNextPreview(next) {
    const state = api()?.getState();
    const box = $('nextExercisePreview');
    if (!box) return;
    if (state?.nextPreview === 'off' || !next) { box.innerHTML=''; return; }
    const exercise = next.exerciseId ? api().getExercise(next.exerciseId) : null;
    const name = exercise?.name || bilingual('Hydration + transition','पानी + बदलाव');
    const media = next.exerciseId && api().mediaApproved(next.exerciseId) ? bilingual('Approved anatomy video','स्वीकृत एनाटॉमी वीडियो') : bilingual('Voice and written guidance','वॉइस और लिखित मार्गदर्शन');
    box.innerHTML = `<div><span>${bilingual('Next exercise','अगला व्यायाम')}</span><strong>${escapeHtml(name)}</strong></div><span>${escapeHtml(media)}</span>`;
  }

  function toggleFocus(force) {
    focusActive = typeof force === 'boolean' ? force : !focusActive;
    document.body.classList.toggle('v4-focus-active', focusActive);
    const b = $('focusModeBtn');
    if (b) { b.textContent = focusActive ? '▤' : '▣'; b.setAttribute('aria-label', focusActive ? 'Exit workout focus mode' : 'Open workout focus mode'); }
  }

  async function toggleFullscreen() {
    const player = $('workoutPlayer');
    if (!player) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (player.requestFullscreen) await player.requestFullscreen();
      else toggleFocus(true);
    } catch { toggleFocus(true); }
  }

  async function applyOrientationPreference(value) {
    const orientation = value || api()?.getState()?.orientation || 'auto';
    if (!screen.orientation?.lock) return;
    try {
      if (orientation === 'auto') screen.orientation.unlock?.();
      else if (document.fullscreenElement) await screen.orientation.lock(orientation === 'landscape' ? 'landscape-primary' : 'portrait-primary');
    } catch { /* browser may disallow orientation lock */ }
  }

  function cycleOrientation() {
    const current = api()?.getState()?.orientation || 'auto';
    const next = current === 'auto' ? 'landscape' : current === 'landscape' ? 'portrait' : 'auto';
    api()?.setPreference('orientation', next);
    if ($('v4Orientation')) $('v4Orientation').value = next;
    api()?.showToast(bilingual(`Orientation: ${next}`,`स्क्रीन दिशा: ${next === 'auto' ? 'स्वचालित' : next === 'landscape' ? 'लैंडस्केप' : 'पोर्ट्रेट'}`));
    applyOrientationPreference(next);
  }

  function bindSettings() {
    const state = api()?.getState(); if (!state) return;
    const controls = {v4AutoAdvance:'autoAdvance',v4NextPreview:'nextPreview',v4Orientation:'orientation',v4StartFocus:'startFocus'};
    for (const [id,key] of Object.entries(controls)) {
      const el=$(id); if(!el) continue;
      el.value=state[key] || ({autoAdvance:'on',nextPreview:'on',orientation:'auto',startFocus:'off'}[key]);
      el.addEventListener('change',()=>{api()?.setPreference(key,el.value);if(key==='orientation')applyOrientationPreference(el.value);updateInstructionPanel();});
    }
  }

  function handleTimerVoice() {
    const timer=$('timerDisplay')?.textContent?.trim()||'';
    if(!/^\d{2}:\d{2}$/.test(timer)||timer===lastTimerText)return;
    lastTimerText=timer;
    const [m,s]=timer.split(':').map(Number),total=m*60+s;
    const state=api()?.getState(),step=api()?.getCurrentStep();
    if(!state||!step?.step)return;
    const rest=restSecondsFor(state.level);
    const isRest=$('timerState')?.classList.contains('rest')||/REST|आराम/.test($('timerState')?.textContent||'');
    if(isRest&&total===rest){
      const next=step.next?.exerciseId?api()?.getExercise(step.next.exerciseId):null;
      const nextName=next?.name||bilingual('the next exercise','अगला व्यायाम');
      const key=`${step.index}-${total}`;
      if(lastRestAnnouncement!==key){
        lastRestAnnouncement=key;
        window.FitnessV4Voice?.speak?.(bilingual(`Rest. Next exercise: ${nextName}.`,`आराम करें। अगला व्यायाम: ${nextName}।`),{interrupt:true});
      }
    }else if(isRest&&[3,2,1].includes(total)){
      window.FitnessV4Voice?.speak?.(String(total),{interrupt:false});
    }
  }

  function bindPlayer() {
    $('focusModeBtn')?.addEventListener('click',()=>toggleFocus());
    $('fullscreenBtn')?.addEventListener('click',toggleFullscreen);
    $('orientationBtn')?.addEventListener('click',cycleOrientation);
    $('closeWorkoutBtn')?.addEventListener('click',()=>{toggleFocus(false);if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});});
    document.addEventListener('fullscreenchange',()=>{const b=$('fullscreenBtn');if(b)b.textContent=document.fullscreenElement?'⤢':'⛶';applyOrientationPreference();});
    document.addEventListener('keydown',e=>{
      if ($('workoutPlayer')?.classList.contains('hidden')) return;
      if (['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.code==='Space'){e.preventDefault();$('playPauseBtn')?.click();}
      else if(e.key==='ArrowRight')$('nextStepBtn')?.click();
      else if(e.key==='ArrowLeft')$('prevStepBtn')?.click();
      else if(e.key.toLowerCase()==='f')toggleFullscreen();
      else if(e.key.toLowerCase()==='r')$('v3RepeatInstruction')?.click();
      else if(e.key==='Escape'&&focusActive)toggleFocus(false);
    });
    const player=$('workoutPlayer');
    if(player){
      const observer=new MutationObserver(()=>{
        const current = $('exerciseName')?.textContent || '';
        const counter = $('stepCounter')?.textContent || '';
        if(current!==lastExerciseName || counter!==lastStepCounter){lastExerciseName=current;lastStepCounter=counter;lastRestAnnouncement='';updateInstructionPanel();}
        handleTimerVoice();
        const state=api()?.getState();
        if(!player.classList.contains('hidden') && state?.startFocus==='on' && !focusActive && !document.fullscreenElement)toggleFocus(true);
      });
      observer.observe(player,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class']});
    }
  }

  function exposeCloudUIFallback() {
    const config=window.FITNESS_FIREBASE_CONFIG;
    const valid=config && config.apiKey && !String(config.apiKey).includes('PASTE_');
    if(!valid){
      $('cloudSyncBadge').textContent=bilingual('Setup required','सेटअप आवश्यक');
      $('cloudSyncBadge').classList.add('v4-sync-warn');
      ['googleSignInBtn','emailSignInBtn','emailCreateBtn','emailResetBtn'].forEach(id=>{if($(id))$(id).disabled=true;});
    }
  }

  function boot() {
    document.querySelector('.brand-button strong').textContent='Fitness V4';
    document.querySelector('.brand-button small').textContent='Anatomy · bilingual · cloud ready';
    bindSettings();
    bindPlayer();
    exposeCloudUIFallback();
    updateInstructionPanel();
    window.addEventListener('fitness-v4-state-saved',()=>{bindSettings();updateInstructionPanel();});
    window.addEventListener('fitness-v4-prefs-saved',updateInstructionPanel);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
