const socket = io();
socket.emit("request data"), socket.on("answer data", e => {
    india_total = e.india_total, india_new = e.india_new
}), sessionStorage.numTimes ? sessionStorage.setItem("numTimes", "1") : sessionStorage.setItem("numTimes", "0");
var state_response, state_total = 0,
    state_new = 0,
    state = "",
    india_total = 0,
    india_new = 0;
async function prepare() {
    await fetch("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"), await fetch("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv"), await fetch("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"), state_response = await fetch("https://data.covid19india.org/v4/min/timeseries.min.json", {mode: 'cors'}), state_response = await state_response.json()
}
var z = sessionStorage.getItem("numTimes");
async function notification() {
    const e = await navigator.serviceWorker.getRegistration();
    Notification.requestPermission().then(t => {
        if ("granted" !== t) alert("you need to allow push notifications to get regular update");
        else {
            const t = (new Date).getTime();
            e.showNotification("Covid19 Case Update", {
                tag: t,
                body: `India Confirmed : ${india_total}\nIndia New : ${india_new}\n${state} Confirmed : ${state_total}\n${state} New : +${state_new}`,
                data: {
                    time: new Date(Date.now()).toString(),
                    message: "Stay Home, Stay Safe",
                    url: "https://covid19-tracker-abhay.herokuapp.com/"
                },
                badge: "assets/images/image/notification.png",
                icon: "assets/images/image/notification.png",
                vibrate: [200, 100, 200, 100, 200, 100, 200],
                actions: [{
                    action: "open",
                    title: "Open app"
                }, {
                    action: "close",
                    title: "Close notification"
                }]
            })
        }
    })
}
0 != z && "0" != z || prepare().then(() => {
    sessionStorage.setItem("numTimes", "1");
    let e = sessionStorage.getItem("locality_code");
    "UK" == e ? e = "UT" : "TS" == e ? e = "TG" : "OD" == e ? e = "OR" : "CG" == e ? e = "CT" : "AD" == e && (e = "AP");
    let t = state_response[e].dates,
        a = t[Object.keys(t)[Object.keys(t).length - 1]];
    state = sessionStorage.getItem("locality_name"), state_total = a.total.confirmed;

    try {   
        state_new = a.delta.confirmed
    } catch (e) {
        state_new = 0
    }
}).then(() => {
    setTimeout(notification, 1e3)
});

async function pingChatBotApi() {
    await fetch('https://covidbot-api.herokuapp.com/?q=Hello')
}
pingChatBotApi().then(() => {
    console.log("Chat Bot Ready To Talk");
});