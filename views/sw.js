importScripts('/cache-polyfill.js');


self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('covidFiles').then(function(cache) {

     return cache.addAll([
       '/',
       '/india',
       '/chart',
       '/news',
       '/assets/css/main.css',
       '/assets/css/theme1.css',
       '/assets/css/jquery.dataTables.min.css',
       '/assets/css/buttons.dataTables.min.css',
       '/assets/css/bootstrap.min.css',
       '/assets/images/virus.png',
       '/assets/images/user.png',
       '/assets/js/core.js',
       '/assets/js/custom_chart.js',
       '/assets/js/jquery.dataTables.min.js',
       '/assets/js/jquery.min.js',
       '/assets/bundles/c3.bundle.js',
       '/assets/bundles/lib.vendor.bundle.js',
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
          return response || fetch(event.request);
        })
    );
});