const CACHE="mal-aguero-v1";
const PRECACHE=["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon-64.png", "arte/animas.jpg", "arte/bala.jpg", "arte/calafate.jpg", "arte/cuero.jpg", "arte/enancada.jpg", "arte/familiar.jpg", "arte/fuego.jpg", "arte/futre.jpg", "arte/lobizon.jpg", "arte/luzmala.jpg", "arte/mulanima.jpg", "arte/pombero.jpg", "arte/punal.jpg", "arte/rezo.jpg", "arte/rosario.jpg", "arte/tabaco.jpg", "arte/ucumar.jpg", "arte/uturunco.jpg", "arte/viuda.jpg", "arte/yasi.jpg"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)).then(()=>self.skipWaiting())); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch",e=>{
  const req=e.request; if(req.method!=="GET") return;
  const url=new URL(req.url);
  if(url.origin===location.origin){
    if(req.mode==="navigate"){
      e.respondWith(fetch(req).then(r=>{ const cp=r.clone(); caches.open(CACHE).then(c=>c.put("index.html",cp)); return r; }).catch(()=>caches.match("index.html")));
      return;
    }
    e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{ if(r.ok){ const cp=r.clone(); caches.open(CACHE).then(c=>c.put(req,cp)); } return r; })));
  } else if(url.hostname.endsWith("fonts.googleapis.com")||url.hostname.endsWith("fonts.gstatic.com")){
    e.respondWith(caches.match(req).then(hit=>{ const net=fetch(req).then(r=>{ const cp=r.clone(); caches.open(CACHE).then(c=>c.put(req,cp)); return r; }).catch(()=>hit); return hit||net; }));
  }
});
