var config,config1,config2,config3,config4,config5,config6;

    xlables = [],
    xlables1 = [],
    ydata1 = [],
    ydata2 = [],
    ydata3 = [],
    ydata4 = [],
    ydata5 = [],
    ydata6 = [],
    india_time = [],
    state_name = "GJ",
    color = Chart.helpers.color,
    series_label = "Confirmed Cases",
    bg = color(window.chartColors.blue).alpha(0.5).rgbString(),
    border = window.chartColors.blue;

var push_confirm = { id: "confirm_cases", label: "Confirmed Cases", backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(), borderColor: window.chartColors.blue, pointRadius: 1, fill: !1, data: ydata1 };
var push_recovered = { id: "recovered_cases", label: "Recovered Cases", backgroundColor: color(window.chartColors.yellow).alpha(0.5).rgbString(), borderColor: window.chartColors.yellow, pointRadius: 1, fill: !1, data: ydata2 };
var push_death = { id: "death", label: "Deaths Cases", backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(), borderColor: window.chartColors.red, pointRadius: 1, fill: !1, data: ydata3 };
var temp = { label: series_label, backgroundColor: bg, borderColor: border, pointRadius: 1, fill: !0, data: india_time };

async function getData() {
    var response = await fetch('https://api.covid19india.org/v4/min/timeseries.min.json');
    var data = await response.json();

    xlables.length = 0;
    xlables = Object.keys(data[state_name].dates);

    ydata1.length = 0;
    ydata2.length = 0;
    ydata3.length = 0;
    ydata4.length = 0;
    ydata5.length = 0;
    ydata6.length = 0;

    var a,b,c,d,e;
    Object.keys(data[state_name]).map(i => {
        xlables.forEach(ele => {
            a = data[state_name][i][ele]['total']['confirmed'] || !1;
            b = data[state_name][i][ele]['total']['recovered'] || !1;
            c = data[state_name][i][ele]['total']['deceased'] || !1;
            d = data[state_name][i][ele]['total']['tested'] || !1;
            e = data[state_name][i][ele]['total']['vaccinated'] || !1;
            ydata1.push(a);
            ydata2.push(b);
            ydata3.push(c);
            ydata4.push(a - b - c);
            ydata5.push(d);
            ydata6.push(e);
        });
    });
}
async function timeSeries(e = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv") {
    var a = await fetch(e);
    let t = (await a.text()).split("\n");
    xlables1 = t[0].split(",").splice(4);
    let d,
        o = 0,
        s = (t = t.splice(1)).length - 1;
    for (; o <= s; ) {
        let e = t[(d = Math.floor((o + s) / 2))].split(",");
        if ("India" == e[1]) break;
        e[1] < "India" ? (o = d + 1) : (s = d - 1);
    }
    (india_time.length = 0), (india_time = t[d].split(",").splice(4)), (temp.data = india_time);
}
function getChart() {
    config = {
        type: "line",
        data: {
            labels: xlables,
            datasets: [
                { id: "confirm_cases", label: 'Confirmed Cases', backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(), borderColor: window.chartColors.red, pointRadius: 1, fill: !1, data: ydata1 }
            ],
        },
        options: {
            responsive: !0,
            maintainAspectRatio: !1,
            scales: { xAxes: [{ ticks: { autoSkip: true, maxTicksLimit: 5, maxRotation: 10, minRotation: 10  }, display: !1 }], yAxes: [{ display: !0 }] },
            tooltips: {
                intersect: !1,
                mode: "index",
                callbacks: {
                    label: function (e, a) {
                        var t = a.datasets[e.datasetIndex].label || "";
                        return t && (t += ": "), (t += e.value);
                    },
                },
            },
        },
    };
    var e = document.getElementById("confirmed").getContext("2d");
    window.myLine = new Chart(e, config);
}   

function getChart1() {
    config2 = {
        type: "line",
        data: {
            labels: xlables,
            datasets: [
                { id: "Recovered Cases", label: "Recovered Cases",  backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(), borderColor: window.chartColors.green, pointRadius: 1, fill: !1, data: ydata2 }
            ],
        },
        options: {
            responsive: !0,
            maintainAspectRatio: !1,
            scales: { xAxes: [{ ticks: { autoSkip: true, maxTicksLimit: 5, maxRotation: 10, minRotation: 10 }, display: !1 }], yAxes: [{ display: !0 }] },
            tooltips: {
                intersect: !1,
                mode: "index",
                callbacks: {
                    label: function (e, a) {
                        var t = a.datasets[e.datasetIndex].label || "";
                        return t && (t += ": "), (t += e.value);
                    },
                },
            },
        },
    };
    var e = document.getElementById("recovered").getContext("2d");
    window.myLine2 = new Chart(e, config2);
} 

function getChart2() {
    config3 = {
        type: "line",
        data: {
            labels: xlables,
            datasets: [
                { id: "Deceased Cases", label: "Deceased Cases",  backgroundColor: color(window.chartColors.grey).alpha(0.5).rgbString(), borderColor: window.chartColors.grey, pointRadius: 1, fill: !1, data: ydata3 }
            ],
        },
        options: {
            responsive: !0,
            maintainAspectRatio: !1,
            scales: { xAxes: [{ ticks: { autoSkip: true, maxTicksLimit: 5, maxRotation: 10, minRotation: 10  }, display: !1}], yAxes: [{ display: !0 }] },
            tooltips: {
                intersect: !1,
                mode: "index",
                callbacks: {
                    label: function (e, a) {
                        var t = a.datasets[e.datasetIndex].label || "";
                        return t && (t += ": "), (t += e.value);
                    },
                },
            },
        },
    };
    var e = document.getElementById("deceased").getContext("2d");
    window.myLine3 = new Chart(e, config3);
} 

function getChart3() {
    config4 = {
        type: "line",
        data: {
            labels: xlables,
            datasets: [
                { id: "Active Cases", label: "Active Cases",  backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(), borderColor: window.chartColors.blue, pointRadius: 1, fill: !1, data: ydata4 }
            ],
        },
        options: {
            responsive: !0,
            maintainAspectRatio: !1,
            scales: { xAxes: [{ ticks: { autoSkip: true, maxTicksLimit: 5, maxRotation: 10, minRotation: 10  }, display: !1 }], yAxes: [{ display: !0 }] },
            tooltips: {
                intersect: !1,
                mode: "index",
                callbacks: {
                    label: function (e, a) {
                        var t = a.datasets[e.datasetIndex].label || "";
                        return t && (t += ": "), (t += e.value);
                    },
                },
            },
        },
    };
    var e = document.getElementById("active").getContext("2d");
    window.myLine4 = new Chart(e, config4);
} 

function getChart4() {
    config5 = {
        type: "line",
        data: {
            labels: xlables,
            datasets: [
                { id: "Tested", label: "Tested",  backgroundColor: color(window.chartColors.purple).alpha(0.5).rgbString(), borderColor: window.chartColors.purple, pointRadius: 1, fill: !1, data: ydata5 }
            ],
        },
        options: {
            responsive: !0,
            maintainAspectRatio: !1,
            scales: { xAxes: [{ ticks: { autoSkip: true, maxTicksLimit: 5, maxRotation: 10, minRotation: 10  }, display: !1 }], yAxes: [{ display: !0 }] },
            tooltips: {
                intersect: !1,
                mode: "index",
                callbacks: {
                    label: function (e, a) {
                        var t = a.datasets[e.datasetIndex].label || "";
                        return t && (t += ": "), (t += e.value);
                    },
                },
            },
        },
    };
    var e = document.getElementById("tested").getContext("2d");
    window.myLine5 = new Chart(e, config5);
}

function getChart5() {
    config6 = {
        type: "line",
        data: {
            labels: xlables,
            datasets: [
                { id: "Vaccinated", label: "Vaccine doses administered",  backgroundColor: color(window.chartColors.yellow).alpha(0.5).rgbString(), borderColor: window.chartColors.yellow, pointRadius: 1, fill: !1, data: ydata6 }
            ],
        },
        options: {
            responsive: !0,
            maintainAspectRatio: !1,
            scales: { xAxes: [{ ticks: { autoSkip: true, maxTicksLimit: 5, maxRotation: 10, minRotation: 10 }, display: !1 }], yAxes: [{ display: !0 }] },
            tooltips: {
                intersect: !1,
                mode: "index",
                callbacks: {
                    label: function (e, a) {
                        var t = a.datasets[e.datasetIndex].label || "";
                        return t && (t += ": "), (t += e.value);
                    },
                },
            },
        },
    };
    var e = document.getElementById("vaccinated").getContext("2d");
    window.myLine6 = new Chart(e, config6);
}

function getConfirmed() {
    config1 = {
        type: "line",
        data: { labels: xlables1, datasets: [{ label: series_label, backgroundColor: bg, borderColor: border, pointRadius: 1, fill: !0, data: india_time }] },
        options: {
            responsive: !0,
            maintainAspectRatio: !1,
            title: { display: !0, text: "India's Cases" },
            scales: { xAxes: [{ ticks: { autoSkip: true, maxTicksLimit: 5, maxRotation: 10, minRotation: 10  }, display: !1, scaleLabel: { display: !0, labelString: "Date" } }], yAxes: [{ display: !0, scaleLabel: { display: !0, labelString: "Number of " + series_label } }] },
            tooltips: {
                intersect: !1,
                mode: "index",
                callbacks: {
                    label: function (e, a) {
                        var t = a.datasets[e.datasetIndex].label || "";
                        return t && (t += ": "), (t += e.value);
                    },
                },
            },
        },
    };
    var e = document.getElementById("canvas1").getContext("2d");
    window.myLine1 = new Chart(e, config1);
}
function addData(e, a, t) {
    e.data.labels.push(a),
    e.data.datasets.forEach((e) => {
        e.data.push(t);
    }),
    e.update();
}
function Select_Type() {
    india_time.length = 0;
    let e = document.getElementById("type").value;
    "confirmed_global.csv" == e.substring(130)
        ? ((temp.label = "Confirmed Cases"), (temp.backgroundColor = color(window.chartColors.blue).alpha(0.5).rgbString()), (temp.borderColor = window.chartColors.blue))
        : "recovered_global.csv" == e.substring(130)
        ? ((temp.label = "Recovered Cases"), (temp.backgroundColor = color(window.chartColors.yellow).alpha(0.5).rgbString()), (temp.borderColor = window.chartColors.yellow))
        : ((temp.label = "Death Cases"), (temp.backgroundColor = color(window.chartColors.red).alpha(0.5).rgbString()), (temp.borderColor = window.chartColors.red)),
        timeSeries(e).then(() => {
            window.myLine1.data.datasets.splice(0), (window.myLine1.options.scales.yAxes[0].scaleLabel.labelString = "Number of " + temp.label), window.myLine1.data.datasets.push(temp), window.myLine1.update();
        });
}

function select_operation() {
    xlables.length = 0;
    ydata1.length = 0;
    ydata2.length = 0;
    ydata3.length = 0;
    ydata4.length = 0;
    ydata5.length = 0;
    ydata6.length = 0;
	
    state_name = document.getElementById('states').value;

    getData().then(() => {
        window.myLine.data.labels = xlables;
        window.myLine2.data.labels = xlables;
        window.myLine3.data.labels = xlables;
        window.myLine4.data.labels = xlables;
        window.myLine5.data.labels = xlables;
        window.myLine6.data.labels = xlables;
        window.myLine.data.datasets[0].data = ydata1;
        window.myLine2.data.datasets[0].data = ydata2;
        window.myLine3.data.datasets[0].data = ydata3;
        window.myLine4.data.datasets[0].data = ydata4;
        window.myLine5.data.datasets[0].data = ydata5;
        window.myLine6.data.datasets[0].data = ydata6;
        window.myLine.update();
        window.myLine2.update();
        window.myLine3.update();
        window.myLine4.update();
        window.myLine5.update();
        window.myLine6.update();
    });
}

getData().then(() => {
    getChart();
    getChart1();
    getChart2();
    getChart3();
    getChart4();
    getChart5();
})
.catch((e) => {
    console.error(e);
    console.log('Error getting data');
});

timeSeries().then(() => {
    getConfirmed();
})
.catch((e) => {
    console.log(e);
});

download_img = function (e) {
    var a = document.getElementById("canvas").toDataURL("image/jpg");
    e.href = a;
};

download_img1 = function (e) {
    var a = document.getElementById("canvas1").toDataURL("image/jpg");
    e.href = a;
};