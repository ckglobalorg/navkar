// Navkar service worker: the app shell is cached; data.json is always fetched fresh first.
const CACHE = "navkar-shell-v1";
const SHELL = ["./", "index.html", "manifest.webmanifest", "apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith("navkar-") && k !== CACHE && k !== "navkar-data").map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.endsWith("/data.json")) {
    e.respondWith(
      fetch(e.request, { cache: "no-store" })
        .then((r) => {
          if (r.ok) { const copy = r.clone(); caches.open("navkar-data").then((c) => c.put("data.json", copy)); }
          return r;
        })
        .catch(() => caches.open("navkar-data").then((c) => c.match("data.json")).then((r) => {
          if (!r) return Response.error();
          const h = new Headers(r.headers); h.set("x-navkar-cache", "1");
          return r.blob().then((b) => new Response(b, { status: 200, headers: h }));
        }))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const net = fetch(e.request).then((r) => {
        if (r.ok && r.type === "basic") { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
        return r;
      }).catch(() => hit || caches.match("index.html"));
      return hit || net;
    })
  );
});
