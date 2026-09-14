// ことばノート オフライン対応（Service Worker）。更新時は CACHE の番号と index.html の ?v= を合わせて上げる。
const CACHE='kotoba-note-v19';
const ASSETS=['./','./index.html','./app.js?v=19','./style.css?v=19','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png','./iphone-qr.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;e.respondWith((async()=>{try{const res=await fetch(req);if(res.ok){const c=await caches.open(CACHE);c.put(req,res.clone())}return res}catch{const cached=await caches.match(req)||(req.mode==='navigate'?await caches.match('./index.html'):undefined);return cached||new Response('オフラインです。一度オンラインで開くと、次からはオフラインでも使えます。',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})}})())});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{const c=list.find(w=>'focus' in w);return c?c.focus():self.clients.openWindow('./')}))});
