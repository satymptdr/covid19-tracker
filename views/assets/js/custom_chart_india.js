let config1,
    xlables_india = [],
    india_time = [],
    color = Chart.helpers.color,
    series_label = "Confirmed Cases",
    bg = color(window.chartColors.red).alpha(.5).rgbString(),
    border = window.chartColors.red;
    temp = {
        label: series_label,
        backgroundColor: bg,
        borderColor: border,
        pointRadius: 1,
        fill: !0,
        data: india_time
    };

async function timeSeries_india(e = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv") {
    var a = await fetch(e);
    let t = (await a.text()).split("\n");
    xlables_india = t[0].split(",").splice(4);
    let o, l = 0,
        d = (t = t.splice(1)).length - 1;
    for (; l <= d;) {
        let e = t[o = Math.floor((l + d) / 2)].split(",");
        if ("India" == e[1]) break;
        e[1] < "India" ? l = o + 1 : d = o - 1
    }
    india_time.length = 0, india_time = t[o].split(",").splice(4), temp.data = india_time
}

function getConfirmed() {
    config1 = {
        type: "line",
        data: {
            labels: xlables_india,
            datasets: [{
                label: series_label,
                backgroundColor: bg,
                borderColor: border,
                pointRadius: 1,
                fill: !0,
                data: india_time
            }]
        },
        options: {
            responsive: !0,
            maintainAspectRatio: !1,
            title: {
                display: !0,
                text: "India's Cases"
            },
            scales: {
                xAxes: [{
                    display: !0,
                    scaleLabel: {
                        display: !0,
                        labelString: "Date"
                    }
                }],
                yAxes: [{
                    display: !0,
                    scaleLabel: {
                        display: !0,
                        labelString: "Number of " + series_label
                    }
                }]
            },
            tooltips: {
                intersect: !1,
                mode: "index",
                callbacks: {
                    label: function(e, a) {
                        var t = a.datasets[e.datasetIndex].label || "";
                        return t && (t += ": "), t + e.value
                    }
                }
            }
        }
    };
    var e = document.getElementById("canvas1").getContext("2d");
    window.india_timeSeries = new Chart(e, config1)
}

function addData(e, a, t) {
    e.data.labels.push(a), e.data.datasets.forEach(e => {
        e.data.push(t)
    }), e.update()
}

function type_select() {
    document.getElementById('Cumulative1').checked = true;
    india_time.length = 0;
    let e = document.getElementById("type").value;
    "confirmed_global.csv" == e.substring(130) ? (temp.label = "Confirmed Cases", temp.backgroundColor = color(window.chartColors.red).alpha(.5).rgbString(), temp.borderColor = window.chartColors.red) : "recovered_global.csv" == e.substring(130) ? (temp.label = "Recovered Cases", temp.backgroundColor = color(window.chartColors.green).alpha(.5).rgbString(), temp.borderColor = window.chartColors.green) : (temp.label = "Death Cases", temp.backgroundColor = color(window.chartColors.grey).alpha(.5).rgbString(), temp.borderColor = window.chartColors.grey), timeSeries_india(e).then(() => {
        window.india_timeSeries.data.datasets.splice(0), window.india_timeSeries.options.scales.yAxes[0].scaleLabel.labelString = "Number of " + temp.label, window.india_timeSeries.data.datasets.push(temp), window.india_timeSeries.update()
    })
}

function cumulative1() {
    window.india_timeSeries.data.datasets.forEach(function(e) {
        e.data = india_time
    }), window.india_timeSeries.update()
}

function daily1() {
    let e = india_time,
        a = [];
    for (let t = 1; t < e.length - 1; ++t) {
        a[t] = e[t] - e[t - 1];
        if(a[t] < 0) a[t]=0;
    }
    window.india_timeSeries.data.datasets.forEach(function(e) {
        e.data = a
    }), window.india_timeSeries.update()
}

timeSeries_india().then(() => {
    getConfirmed()
}).catch(e => {
    console.log(e)
}), download_img1 = function(e) {
    var a = document.getElementById("canvas1").toDataURL("image/jpg");
    e.href = a
};


// Charts for dashboard
/**********************/
