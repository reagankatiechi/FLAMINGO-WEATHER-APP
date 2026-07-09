const CACHE_NAME = "flamingo-weather-v2";

const STATIC_FILES = [
    "/",
    "/index.html",
    "/dashboard.html",
    "/alerts.html",
    "/pledge.html",
    "/style.css",
    "/dashboard.css",
    "/script.js",
    "/dashboard.js",
    "/manifest.json",
    "/offline.html",
    "/flamingo_logo.jpeg",
    "/weather.jpeg"
];

// Install
self.addEventListener("install", event => {

    self.skipWaiting();

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => cache.addAll(STATIC_FILES))

    );

});

// Activate

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys =>

            Promise.all(

                keys

                .filter(key => key !== CACHE_NAME)

                .map(key => caches.delete(key))

            )

        )

    );

    self.clients.claim();

});

// Fetch

self.addEventListener("fetch", event => {

    event.respondWith(

        fetch(event.request)

        .then(response => {

            const copy = response.clone();

            caches.open(CACHE_NAME)

            .then(cache => cache.put(event.request, copy));

            return response;

        })

        .catch(() =>

            caches.match(event.request)

        )

    );

});

// Listen for Update button

self.addEventListener("message", event => {

    if (event.data.type === "SKIP_WAITING") {

        self.skipWaiting();

    }

});