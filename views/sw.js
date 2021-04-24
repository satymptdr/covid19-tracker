importScripts("/cache-polyfill.js"),
    self.addEventListener("install", function (e) {
        console.log("Installed");
    });
var isValid = function (e) {
        if (!e) return !1;
        var t = e.headers.get("sw-fetched-on");
        return !!(t && parseFloat(t) + 36e5 > new Date().getTime());
    },
    isValidFront = function (e) {
        if (!e) return !1;
        var t = e.headers.get("sw-fetched-on");
        return !!(t && parseFloat(t) + 3e5 > new Date().getTime());
    };
self.addEventListener("fetch", function (e) {
    const { request: t } = e;
    t.url.includes("/time_series_covid19_confirmed_global.csv") || t.url.includes(".css") || t.url.includes("/time_series_covid19_recovered_global.csv") || t.url.includes("/time_series_covid19_deaths_global.csv") || t.url.includes("/timeseries.min.json")
        ? e.respondWith(
              caches.match(t).then((n) =>
                  isValid(n)
                      ? n
                      : fetch(t).then((n) => {
                            var s = n.clone();
                            return (
                                e.waitUntil(
                                    caches.open("covidFiles").then((e) => {
                                        var n = new Headers(s.headers);
                                        return (
                                            n.append("sw-fetched-on", new Date().getTime()),
                                            s.text().then(function (i) {
                                                return e.put(t, new Response(i, { status: s.status, statusText: s.statusText, headers: n }));
                                            })
                                        );
                                    })
                                ),
                                n
                            );
                        })
              )
          )
        : (t.url.includes(".jpg") || t.url.includes(".png") || t.url.includes(".js") || t.url.includes(".jpeg") || t.url.includes("/india") || t.url.includes("/chart") || t.url.includes("/news")) &&
          e.respondWith(
              caches.match(t).then((n) =>
                  isValidFront(n)
                      ? n
                      : fetch(t).then((n) => {
                            var s = n.clone();
                            return (
                                e.waitUntil(
                                    caches.open("covidFiles").then((e) => {
                                        var n = new Headers(s.headers);
                                        return (
                                            n.append("sw-fetched-on", new Date().getTime()),
                                            s.blob().then(function (i) {
                                                return e.put(t, new Response(i, { status: s.status, statusText: s.statusText, headers: n }));
                                            })
                                        );
                                    })
                                ),
                                n
                            );
                        })
              )
          );
}),
    self.addEventListener("notificationclick", (e) => {
        "close" === e.action
            ? e.notification.close()
            : e.waitUntil(
                  clients.matchAll({ type: "window" }).then((t) => {
                      t.some((t) => t.url === e.notification.data.url && (t.focus(), !0)) || clients.openWindow(e.notification.data.url).then((e) => (e ? e.focus() : null));
                  })
              );
    });
