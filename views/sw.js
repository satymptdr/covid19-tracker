importScripts('/cache-polyfill.js');

self.addEventListener('install', function(e) {
  console.log('Installed');
});

var isValid = function (response) {
	if (!response) return false;
	var fetched = response.headers.get('sw-fetched-on');
	if (fetched && (parseFloat(fetched) + (60 * 60 * 1000)) > new Date().getTime()) return true;
	return false;
};

var isValidFront = function (response) {
	if (!response) return false;
	var fetched = response.headers.get('sw-fetched-on');
	if (fetched && (parseFloat(fetched) + (300 * 1000)) > new Date().getTime()) return true;
	return false;
};

self.addEventListener('fetch', function(event) {
  const {request} = event;

  if(request.url.includes('/time_series_covid19_confirmed_global.csv') || request.url.includes('/time_series_covid19_recovered_global.csv') || request.url.includes('/time_series_covid19_deaths_global.csv') || request.url.includes('/timeseries.min.json')) {
    event.respondWith(
      caches.match(request).then(response => {
        if(isValid(response)) {
          return response;
        }
        return fetch(request).then(response => {
          var copy = response.clone();
          event.waitUntil(caches.open('covidFiles').then(cache => {
            var headers = new Headers(copy.headers);
            headers.append('sw-fetched-on', new Date().getTime());
            return copy.text().then(function (body) {
              return cache.put(request, new Response(body, {
                status: copy.status,
							  statusText: copy.statusText,
                headers: headers
              }));
            });
          }));
          return response;
        });
      })
    );
  }
  else if(request.url.includes('/') || request.url.includes('/india') || request.url.includes('/chart') || request.url.includes('/news')) {
    event.respondWith(
      caches.match(request).then(response => {
        if(isValidFront(response)) {
          return response;
        }
        return fetch(request).then(response => {
          var copy = response.clone();
          event.waitUntil(caches.open('covidFiles').then(cache => {
            var headers = new Headers(copy.headers);
            headers.append('sw-fetched-on', new Date().getTime());
            return copy.blob().then(function (body) {
              return cache.put(request, new Response(body, {
                status: copy.status,
							  statusText: copy.statusText,
                headers: headers
              }));
            });
          }));
          return response;
        });
      })
    );
  }
});