const SHELL_CACHE='fitness-v6-1-shell-v1';
const MEDIA_CACHE='fitness-v6-1-media-v1';
const SHELL=[
  './','./index.html','./styles.css','./voice-language.css','./v4.css','./anatomy-motion.css','./final-player.css','./anatomy-motion.js','./app.js','./voice-language.js','./v4.js','./firebase-config.js','./cloud-sync.js','./manifest.webmanifest',
  './icons/icon-192.png','./icons/icon-512.png','./assets/ui/anatomy-motion-poster.svg','./assets/posters/highKnees-clean.jpg','./assets/videos/highKnees-clean.mp4','./assets/muscles/highKnees.svg'
];
self.addEventListener('install',event=>{event.waitUntil(caches.open(SHELL_CACHE).then(c=>c.addAll(SHELL)));});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>{
    const old=k.startsWith('health-app-v2-')||k.startsWith('fitness-v3-')||k.startsWith('fitness-v4-')||k.startsWith('fitness-v5-')||k.startsWith('fitness-v6-');
    return old&&k!==SHELL_CACHE&&k!==MEDIA_CACHE;
  }).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET')return;
  const url=new URL(req.url);if(url.origin!==location.origin)return;
  if(req.headers.has('range')&&url.pathname.endsWith('.mp4')){event.respondWith(rangeResponse(req));return;}
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(res=>{const copy=res.clone();caches.open(SHELL_CACHE).then(c=>c.put('./index.html',copy));return res;}).catch(()=>caches.match('./index.html')));
    return;
  }
  if(url.pathname.endsWith('.mp4')){
    event.respondWith(caches.open(MEDIA_CACHE).then(async cache=>{
      const hit=await cache.match(req);if(hit)return hit;
      const res=await fetch(req);if(res.ok)cache.put(req,res.clone());return res;
    }));
    return;
  }
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(SHELL_CACHE).then(c=>c.put(req,copy));}return res;})));
});
async function rangeResponse(req){
  const cache=await caches.open(MEDIA_CACHE);let res=await cache.match(req.url);
  if(!res){try{res=await fetch(req.url);if(res.ok)await cache.put(req.url,res.clone());}catch{return new Response('',{status:504});}}
  const buf=await res.arrayBuffer(),range=req.headers.get('range'),m=/bytes=(\d+)-(\d*)/.exec(range||'');
  if(!m)return new Response(buf,{headers:res.headers});
  const start=Number(m[1]),end=Math.min(m[2]?Number(m[2]):buf.byteLength-1,buf.byteLength-1);
  return new Response(buf.slice(start,end+1),{status:206,statusText:'Partial Content',headers:{'Content-Type':'video/mp4','Content-Range':`bytes ${start}-${end}/${buf.byteLength}`,'Accept-Ranges':'bytes','Content-Length':String(end-start+1)}});
}
