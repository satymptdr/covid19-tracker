let code = sessionStorage.getItem("locality_code");

function isStateExists() {
    let e = document.getElementById("states");
    for (let a = 0; a < e.length; ++a)
        if (e[a].value == code) return !0;
    return !1
}

const population = {
    "AN": 397000,
    "AP": 52221000,
    "AR": 1504000,
    "AS": 34293000,
    "BR": 119520000,
    "CH": 1179000,
    "CT": 28724000,
    "DL": 19814000,
    "DN": 959000,
    "GA": 1540000,
    "GJ": 67936000,
    "HP": 7300000,
    "HR": 28672000,
    "JH": 37403000,
    "JK": 13203000,
    "KA": 65798000,
    "KL": 35125000,
    "LA": 293000,
    "LD": 68000,
    "MH": 122153000,
    "ML": 3224000,
    "MN": 3103000,
    "MP": 82232000,
    "MZ": 1192000,
    "NL": 2150000,
    "OR": 43671000,
    "PB": 29859000,
    "PY": 1504000,
    "RJ": 77264000,
    "SK": 664000,
    "TG": 37220000,
    "TN": 75695000,
    "TR": 3992000,
    "UP": 224979000,
    "UT": 11141000,
    "WB": 96906000
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
    ydata1_last, ydata2_last, ydata4_last,
    india_time = [],
    state_name = "GJ",
    country = "_India",
    vaccine1=0, vaccine2=0,
    color = Chart.helpers.color,
    series_label = "Confirmed Cases",
    bg = color(window.chartColors.red).alpha(.5).rgbString(),
    border = window.chartColors.red;
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
    var e, a, t, o, l, d = await fetch("https://data.covid19india.org/v4/min/timeseries.min.json", {mode: 'cors'}),
        n = await d.json();
    xlables.length = 0, xlables = Object.keys(n[state_name].dates), ydata1.length = 0, ydata2.length = 0, ydata3.length = 0, ydata4.length = 0, ydata5.length = 0, ydata6.length = 0, Object.keys(n[state_name]).map(d => {
        xlables.forEach(r => {
            e = n[state_name][d][r].total.confirmed || !1, a = n[state_name][d][r].total.recovered || !1, t = n[state_name][d][r].total.deceased || !1, o = n[state_name][d][r].total.tested || !1, vaccine1 = l = n[state_name][d][r].total.vaccinated1 || !1, vaccine2=n[state_name][d][r].total.vaccinated2 || !1, ydata1.push(e), ydata2.push(a), ydata3.push(t), ydata5.push(o), ydata6.push(l), ydata4.push(e - a - t)
        })
    }), state_obj[0].data = ydata1, state_obj[1].data = ydata2, state_obj[2].data = ydata4, state_obj[3].data = ydata3, state_obj[4].data = ydata5, state_obj[5].data = ydata6
    let index = xlables.length;
    ydata1_last = ydata1[index - 1], ydata2_last = ydata2[index - 1], ydata4_last = ydata4[index - 1];
}

async function timeSeries(e = 0, c) {
    var a;
    if(e == 0) {
        a = await fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv');
    }
    else if(e == 1) {
        a = await fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv');
    }
    else {
        a = await fetch('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv');
    }
    let t = (await a.text()).split("\n");

    xlables1 = t[0].split(",").splice(4);
    var o, d = (t = t.splice(1)).length - 1, mid = Math.floor(d / 2);
    let flag=0;

    for(let i=mid; i<=d; ++i) {
        o=i, e=t[i].split(",");
        if (c.localeCompare(e[0]+"_"+e[1]) == 0) { flag=1; break; }
    }
    if(!flag) {
        for(let i=0; i<mid; ++i) {
            o=i, e=t[i].split(",");
            console.log(c + " : " + e[0]+"_"+e[1]);
            if (c.localeCompare(e[0]+"_"+e[1]) == 0) { break; }
        }
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
    window.myLine1 = new Chart(e, config1)
}

function getBarChart() {
    var ctx = document.getElementById("bar_chart_states");
    let last_index = ydata1.length-1;
    window.bar_chart_states = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Confirmed", "Recovered", "Active", "Deceased"],
            datasets: [{
                label: '# of Cases',
                data: [ydata1[last_index], ydata2[last_index], ydata4[last_index], ydata1[last_index] - ydata2[last_index] - ydata4[last_index]],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.4)',
                    'rgba(75, 192, 192, 0.4)',
                    'rgba(54, 162, 235, 0.4)',
                    'rgba(201, 203, 207, 0.4)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(201, 203, 207, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: !0,
            maintainAspectRatio: !1,
            scales: {
                xAxes: [{
                    gridLines: {
                        offsetGridLines: true
                    },
                    display: !0,
                    scaleLabel: {
                        display: !0,
                        labelString: "Category"
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    display: !0,
                    scaleLabel: {
                        display: !0,
                        labelString: "Number of cases"
                    }
                }]
            }
        }
    });
}

function addData(e, a, t) {
    e.data.labels.push(a), e.data.datasets.forEach(e => {
        e.data.push(t)
    }), e.update()
}

function updateBarChart() {
    window.bar_chart_states.data.datasets[0].data = [ydata1_last, ydata2_last, ydata4_last, ydata1_last - ydata2_last - ydata4_last]
    window.bar_chart_states.update();
}

function select_operation() {
    xlables.length = 0, ydata1.length = 0, ydata2.length = 0, ydata3.length = 0, ydata4.length = 0, ydata5.length = 0, ydata6.length = 0, state_name = document.getElementById("states").value, getData().then(() => {
        document.getElementById("label").innerHTML = "Fully vaccinated (" + ((vaccine2 / population[state_name]) * 100).toFixed(2) + "%) - " + vaccine2;
        document.getElementById("progress-text").innerHTML = ((vaccine1 / population[state_name]) * 100).toFixed(2) + "% - " + vaccine1;
        document.getElementById("upper-label").style.width = ((vaccine1 / population[state_name]) * 100 - 5) + "%";
        document.getElementById("upper-arrow").style.marginLeft = ((vaccine1 / population[state_name]) * 100) + "%";
        document.getElementById("lower-label").style.width = ((vaccine2 / population[state_name]) * 100 - 3) + "%";
        document.getElementById("lower-arrow").style.marginLeft = ((vaccine2 / population[state_name]) * 100) + "%";
        document.getElementById("value").style.width = ((vaccine1 / population[state_name]) * 100) + "%";
        document.getElementById("opaque").style.width = ((vaccine2 / population[state_name]) * 100) + "%";
        window.myLine.data.labels = xlables, window.myLine.data.datasets[0].data = ydata1, window.myLine.data.datasets[0].label = state_obj[0].label, window.myLine.data.datasets[0].backgroundColor = state_obj[0].backgroundColor, window.myLine.data.datasets[0].borderColor = state_obj[0].borderColor, window.myLine.update()
        updateBarChart();
    })
    g_idx = 0; 
    document.getElementById("caseType").style.display = "block";
    document.getElementById('Cumulative').checked=true;
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

function Select_Country() {
    document.getElementById('Cumulative1').checked = true;
    country = document.getElementById('type').value;
    console.log(country);
    india_time.length = 0;

    timeSeries(0, country).then(() => {
        temp.label = "Confirmed Cases", temp.backgroundColor = color(window.chartColors.red).alpha(.5).rgbString(), temp.borderColor = window.chartColors.red
        window.myLine1.data.datasets.splice(0), window.myLine1.options.scales.yAxes[0].scaleLabel.labelString = "Number of " + temp.label, window.myLine1.data.datasets.push(temp), window.myLine1.update()
    }).catch(e => {
        console.log(e)
    })
}

function changeDataType(e) {
    document.getElementById('Cumulative1').checked = true;
    india_time.length = 0;
    e == 0 ? (temp.label = "Confirmed Cases", temp.backgroundColor = color(window.chartColors.red).alpha(.5).rgbString(), temp.borderColor = window.chartColors.red) : e == 1 ? (temp.label = "Recovered Cases", temp.backgroundColor = color(window.chartColors.green).alpha(.5).rgbString(), temp.borderColor = window.chartColors.green) : (temp.label = "Death Cases", temp.backgroundColor = color(window.chartColors.grey).alpha(.5).rgbString(), temp.borderColor = window.chartColors.grey), timeSeries(e, country).then(() => {
        window.myLine1.data.datasets.splice(0), window.myLine1.options.scales.yAxes[0].scaleLabel.labelString = "Number of " + temp.label, window.myLine1.data.datasets.push(temp), window.myLine1.update()
    })
}

function cumulative1() {
    window.myLine1.data.datasets.forEach(function(e) {
        e.data = india_time
    }), window.myLine1.update()
}

function daily1() {
    let e = india_time,
        a = [];
    for (let t = 1; t < e.length - 1; ++t) {
        a[t] = e[t] - e[t - 1];
        if(a[t] < 0) a[t]=0;
    }
    window.myLine1.data.datasets.forEach(function(e) {
        e.data = a
    }), window.myLine1.update()
}

getData().then(() => {
    document.getElementById("label").innerHTML = "Fully vaccinated (" + ((vaccine2 / population[state_name]) * 100).toFixed(2) + "%) - " + vaccine2;
    document.getElementById("progress-text").innerHTML = ((vaccine1 / population[state_name]) * 100).toFixed(2) + "% - " + vaccine1;
    document.getElementById("upper-label").style.width = ((vaccine1 / population[state_name]) * 100 - 5) + "%";
    document.getElementById("upper-arrow").style.marginLeft = ((vaccine1 / population[state_name]) * 100) + "%";
    document.getElementById("lower-label").style.width = ((vaccine2 / population[state_name]) * 100 - 3) + "%";
    document.getElementById("lower-arrow").style.marginLeft = ((vaccine2 / population[state_name]) * 100) + "%";
    document.getElementById("value").style.width = ((vaccine1 / population[state_name]) * 100) + "%";
    document.getElementById("opaque").style.width = ((vaccine2 / population[state_name]) * 100) + "%";
    getChart()
}).then(() => {
    getBarChart();
}).catch(e => {
    console.error(e)
}), timeSeries(0, country).then(() => {
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