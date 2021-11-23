var CACHE = "budget-cache";
const DATA_CACHE = "budget-data-cache";

var urls = [
    "/"
    , "/db.js"
    , "/index.js"
    , "/manifest.json"
    , "/styles.css"
    , "/icons/icon-192x192.png"
    , "/icons/icon-512x512.png"
    , "https://cdn.jsdelivr.net/npm/chart.js@2.8.0"
];

self.addEventListener("install", function(e) {
    e.waitUntil(
        caches.open(CACHE).then(function(cache) {
            return cache.addAll(urls);
        })
    );
});

self.addEventListener("fetch", function(e) {
    if (e.request.url.includes("/api/")) {
        e.respondWith(
            caches.open(DATA_CACHE).then(cache => {
                return fetch(e.request)
                .then(response => {
                    if (response.status === 200) {
                        cache.put(e.request.url, response.clone());
                    }

                    return response;
                })
                .catch(err => {
                    return cache.match(e.request);
                });
            }).catch(err => console.log(err))
        );

        return;
    }

    e.respondWith(
        fetch(e.request).catch(function() {
            return caches.match(e.request).then(function(response) {
                if (response) {
                    return response;
                } else if (e.request.headers.get("accept").includes("text/html")) {
                    return caches.match("/");
                }
            });
        })
    );
});
