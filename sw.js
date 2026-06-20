if (request.url.startsWith('https://fonts.googleapis.com') ||
    request.url.startsWith('https://unpkg.com')) {
  event.respondWith(
    caches.match(request).then(cached => {
      return cached || fetch(request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(request, response.clone());
          return response;
        });
      });
    })
  );
  return;
}
