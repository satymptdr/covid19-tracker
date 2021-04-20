let code = sessionStorage.getItem("locality_code");

function isStateExists() {
    let e = document.getElementById("states");
    for (let a = 0; a < e.length; ++a)
        if (e[a].value == code) return !0;
    return !1
}
var config, config1, g_idx = 0,
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
    bg = color(window.chartColors.blue).alpha(.5).rgbString(),
    border = window.chartColors.blue;
isStateExists() ? (document.getElementById("states").value = code, state_name = code) : "UK" == code ? (document.getElementById("states").value = "UT", state_name = "UT") : "TS" == code ? (document.getElementById("states").value = "TG", state_name = "TG") : "OD" == code ? (document.getElementById("states").value = "OR", state_name = "OR") : "CG" == code ? (document.getElementById("states").value = "CT", state_name = "CT") : "AD" == code ? (document.getElementById("states").value = "AP", state_name = "AP") : document.getElementById("states").value = "GJ";
var state_obj = [{
        id: "confirm_cases",
        label: "Confirm",
        backgroundColor: color(window.chartColors.red).alpha(.5).rgbString(),
        borderColor: window.chartColors.red,
        data: null
    }, {
        id: "recovered_cases",
        label: "Recovered",
        backgroundColor: color(window.chartColors.green).alpha(.5).rgbString(),
        borderColor: window.chartColors.green,
        data: null
    }, {
        id: "active",
        label: "Active",
        backgroundColor: color(window.chartColors.blue).alpha(.5).rgbString(),
        borderColor: window.chartColors.blue,
        data: null
    }, {
        id: "death",
        label: "Deceased",
        backgroundColor: color(window.chartColors.grey).alpha(.5).rgbString(),
        borderColor: window.chartColors.grey,
        data: null
    }, {
        id: "tested",
        label: "Tested",
        backgroundColor: color(window.chartColors.purple).alpha(.5).rgbString(),
        borderColor: window.chartColors.purple,
        data: null
    }, {
        id: "vaccinated",
        label: "Vaccinated",
        backgroundColor: color(window.chartColors.yellow).alpha(.5).rgbString(),
        borderColor: window.chartColors.yellow,
        data: null
    }],
    temp = {
        label: series_label,
        backgroundColor: bg,
        borderColor: border,
        pointRadius: 1,
        fill: !0,
        data: india_time
    };
async function getData() {
    var e, a, t, o, l, d = await fetch("https://api.covid19india.org/v4/min/timeseries.min.json"),
        n = await d.json();
    xlables.length = 0, xlables = Object.keys(n[state_name].dates), ydata1.length = 0, ydata2.length = 0, ydata3.length = 0, ydata4.length = 0, ydata5.length = 0, ydata6.length = 0, Object.keys(n[state_name]).map(d => {
        xlables.forEach(r => {
            e = n[state_name][d][r].total.confirmed || !1, a = n[state_name][d][r].total.recovered || !1, t = n[state_name][d][r].total.deceased || !1, o = n[state_name][d][r].total.tested || !1, l = n[state_name][d][r].total.vaccinated || !1, ydata1.push(e), ydata2.push(a), ydata3.push(t), ydata5.push(o), ydata6.push(l), ydata4.push(e - a - t)
        })
    }), state_obj[0].data = ydata1, state_obj[1].data = ydata2, state_obj[2].data = ydata4, state_obj[3].data = ydata3, state_obj[4].data = ydata5, state_obj[5].data = ydata6
}
async function timeSeries(e = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv") {
    var a = await fetch(e);
    let t = (await a.text()).split("\n");
    xlables1 = t[0].split(",").splice(4);
    let o, l = 0,
        d = (t = t.splice(1)).length - 1;
    for (; l <= d;) {
        let e = t[o = Math.floor((l + d) / 2)].split(",");
        if ("India" == e[1]) break;
        e[1] < "India" ? l = o + 1 : d = o - 1
    }
    india_time.length = 0, india_time = t[o].split(",").splice(4), temp.data = india_time
}

function getChart() {
    config = {
        type: "line",
        data: {
            labels: xlables,
            datasets: [{
                label: "Confirm",
                backgroundColor: color(window.chartColors.red).alpha(.5).rgbString(),
                borderColor: window.chartColors.red,
                pointRadius: 1,
                fill: !1,
                data: ydata1
            }]
        },
        options: {
            responsive: !0,
            maintainAspectRatio: !1,
            title: {
                display: !0,
                text: "Corona Virus Cases Visualization"
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
                        labelString: "Number of Cases"
                    }
                }]
            },
            plugins: {
                zoom: {
                    // Container for pan options
                    pan: {
                        enabled: true,
                        mode: 'xy'
                    },
    
                    // Container for zoom options
                    zoom: {
                        enabled: true,
                        mode: 'xy',
                    }
                }
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
    var e = document.getElementById("canvas").getContext("2d");
    window.myLine = new Chart(e, config)
}

function getConfirmed() {
    config1 = {
        type: "line",
        data: {
            labels: xlables1,
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
            plugins: {
                zoom: {
                    // Container for pan options
                    pan: {
                        enabled: true,
                        mode: 'yx'
                    },
    
                    // Container for zoom options
                    zoom: {
                        enabled: true,
                        mode: 'yx',
                    }
                }
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
    window.myLine1 = new Chart(e, config1)
}

function addData(e, a, t) {
    e.data.labels.push(a), e.data.datasets.forEach(e => {
        e.data.push(t)
    }), e.update()
}

function Select_Type() {
    india_time.length = 0;
    let e = document.getElementById("type").value;
    "confirmed_global.csv" == e.substring(130) ? (temp.label = "Confirmed Cases", temp.backgroundColor = color(window.chartColors.blue).alpha(.5).rgbString(), temp.borderColor = window.chartColors.blue) : "recovered_global.csv" == e.substring(130) ? (temp.label = "Recovered Cases", temp.backgroundColor = color(window.chartColors.yellow).alpha(.5).rgbString(), temp.borderColor = window.chartColors.yellow) : (temp.label = "Death Cases", temp.backgroundColor = color(window.chartColors.red).alpha(.5).rgbString(), temp.borderColor = window.chartColors.red), timeSeries(e).then(() => {
        window.myLine1.data.datasets.splice(0), window.myLine1.options.scales.yAxes[0].scaleLabel.labelString = "Number of " + temp.label, window.myLine1.data.datasets.push(temp), window.myLine1.update()
    })
}

function select_operation() {
    xlables.length = 0, ydata1.length = 0, ydata2.length = 0, ydata3.length = 0, ydata4.length = 0, ydata5.length = 0, ydata6.length = 0, state_name = document.getElementById("states").value, getData().then(() => {
        window.myLine.data.labels = xlables, window.myLine.data.datasets[0].data = ydata1, window.myLine.data.datasets[0].label = state_obj[0].label, window.myLine.data.datasets[0].backgroundColor = state_obj[0].backgroundColor, window.myLine.data.datasets[0].borderColor = state_obj[0].borderColor, window.myLine.update()
    })
    g_idx = 0; document.getElementById('Cumulative').checked=true;
}

function changeData(e) {
    g_idx = e, 2 == e || 4 == e || 5 == e ? (document.getElementById("caseType").style.display = "none", document.getElementById("myDIV").style.margin = "0px 0px 15px 0px") : document.getElementById("caseType").style.display = "block", document.getElementById("Cumulative").checked = !0, window.myLine.data.datasets.forEach(function(a) {
        a.label = state_obj[e].label, a.data = state_obj[e].data, a.backgroundColor = state_obj[e].backgroundColor, a.borderColor = state_obj[e].borderColor
    }), window.myLine.update()
}

function cumulative() {
    window.myLine.data.datasets.forEach(function(e) {
        e.label = state_obj[g_idx].label, e.data = state_obj[g_idx].data, e.backgroundColor = state_obj[g_idx].backgroundColor, e.borderColor = state_obj[g_idx].borderColor
    }), window.myLine.update()
}

function daily() {
    let e = state_obj[g_idx].data,
        a = [];
    for (let t = 1; t < e.length - 1; ++t) {
        a[t] = e[t] - e[t - 1];
        if(a[t] < 0) a[t]=0;
    }
    window.myLine.data.datasets.forEach(function(e) {
        e.label = state_obj[g_idx].label, e.data = a, e.borderColor = state_obj[g_idx].borderColor, e.backgroundColor = state_obj[g_idx].backgroundColor
    }), window.myLine.update()
}
getData().then(() => {
    getChart()
}).catch(e => {
    console.error(e)
}), timeSeries().then(() => {
    getConfirmed()
}).catch(e => {
    console.log(e)
}), download_img = function(e) {
    var a = document.getElementById("canvas").toDataURL("image/jpg");
    e.href = a
}, download_img1 = function(e) {
    var a = document.getElementById("canvas1").toDataURL("image/jpg");
    e.href = a
};

window.resetZoom1 = function() {
    window.myLine.resetZoom();
};
window.resetZoom2 = function() {
    window.myLine1.resetZoom();
};