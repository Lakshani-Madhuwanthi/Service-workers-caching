const cachedname = 'v1';

const cacheAsserts = [
    'index.html',
    'about.html',
    '/css/style.css',
    '/js/main.js'
]

//Call Install Event
self.addEventListener('install', (e) => {
    console.log('service worker installed')

    e.waitUntil(
        caches.open(cachedname).then((cache) => {
            console.log('caching files')
            cache.addAll(cacheAsserts)
        })
        .then(() => self.skipWaiting())
    )
})

//Call Activate Event
self.addEventListener('activate', (e) => {
    console.log('service worker activated')
    // Remove unwanted caches
    e.waiteUntil(
        caches.keys().then(cachedNames => {
            return Promise.all(
                cachedNames.map(cache => {
                    if(cache !== cachedname){
                        console.log('clearing old cache')
                        return caches.delete(cache)
                    }
                })
            )
        })
    )
})

//call Fetch Event
self.addEventListener('fetch', (e) => {
    console.log('fetch event')
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    )
})