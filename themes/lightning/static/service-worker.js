importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.4/workbox-sw.js"
);

workbox.navigationPreload.enable();

workbox.routing.registerRoute(
  ({ request, url }) =>
    request.mode === "navigate" && !url.pathname.startsWith("/posts/"),
  new workbox.strategies.NetworkFirst()
);

workbox.routing.registerRoute(
  ({ request, url }) =>
    request.mode === "navigate" && url.pathname.startsWith("/posts/"),
  new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === "script" || request.destination === "style",
  new workbox.strategies.StaleWhileRevalidate()
);

// remove previous version cache storage
caches.delete("v1");
