const STATIC_CACHE = "zap-static-v2"
const DATA_CACHE = "zap-data-v2"

const STATIC_ASSETS = [
    "./",
    "./index.html",
    "./assets/styles.css",
    "./app/app.js"
]

self.addEventListener("install", event=>{
    event.waitUntil(
        caches.open(STATIC_CACHE).then(cache=>cache.addAll(STATIC_ASSETS))
    )
})

self.addEventListener("activate", event=>{
    event.waitUntil(
        caches.keys().then(keys=>{
            return Promise.all(
                keys
                    .filter(key=>![STATIC_CACHE, DATA_CACHE].includes(key))
                    .map(key=>caches.delete(key))
            )
        })
    )
})

self.addEventListener("fetch", event=>{
    const request = event.request
    if(request.method !== "GET") return

    const url = new URL(request.url)
    if(url.origin !== location.origin) return

    if(url.pathname.includes("/data/")){
        event.respondWith(cacheFirst(DATA_CACHE, request))
        return
    }

    event.respondWith(staleWhileRevalidate(STATIC_CACHE, request))
})

async function cacheFirst(cacheName, request){
    const cache = await caches.open(cacheName)
    const cached = await cache.match(request)
    if(cached) return cached
    const response = await fetch(request)
    cache.put(request, response.clone())
    return response
}

async function staleWhileRevalidate(cacheName, request){
    const cache = await caches.open(cacheName)
    const cached = await cache.match(request)
    const fetchPromise = fetch(request).then(response=>{
        cache.put(request, response.clone())
        return response
    }).catch(()=>cached)
    return cached || fetchPromise
}
