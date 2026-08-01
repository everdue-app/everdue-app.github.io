/* everdue-app.github.io is retired — EverDue lives at
   https://arcadapt.github.io/arcadapt-register/

   This file replaces the V0.04 worker, which was cache-first for the document.
   On its own, deleting or redirecting index.html would NOT reach a device that
   had installed the old PWA: that device answers its own navigations from the
   V0.04 cache and never asks the network. The browser does re-fetch sw.js
   though, so this is the one file that can reliably retire the old app.

   It caches nothing and, deliberately, registers NO fetch handler at all — a
   worker without one does not intercept, so every request goes to the network
   even in the moments before it finishes removing itself. */
self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil((async function () {
    try {
      const keys = await caches.keys();               /* this origin's caches only */
      await Promise.all(keys.map(k => caches.delete(k).catch(() => {})));
    } catch (err) {}
    try { await self.registration.unregister(); } catch (err) {}
    try {
      const cs = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const c of cs) {
        try { await c.navigate("https://arcadapt.github.io/arcadapt-register/"); } catch (err) {}
      }
    } catch (err) {}
  })());
});
