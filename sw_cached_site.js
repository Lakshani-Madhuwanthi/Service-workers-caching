const cachedname = 'v2';

//Call Install Event
self.addEventListener('install', (e) => {
    console.log('service worker installed')
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
        fetch(e.request).then(
            res => {
                // Make copy/clone of response
                const resClone = res.clone();
                // Open cache
                caches
                    .open(cachedname)
                    .then(cache => {
                        // Add response to cache
                        cache.put(e.request, resClone)
                    })
                return res
            }
        ).catch(err => caches.match(e.request).then(res => res))
    )
})