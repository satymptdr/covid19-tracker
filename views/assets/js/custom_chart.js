var config,
    config1,
    xlables = [],
    xlables1 = [],
    ydata1 = [],
    ydata2 = [],
    ydata3 = [],
    state = [],
    india_time = [],
    state_name = "Gujarat",
    color = Chart.helpers.color,
    series_label = "Confirmed Cases",
    bg = color(window.chartColors.blue).alpha(0.5).rgbString(),
    border = window.chartColors.blue;

var push_confirm = { id: "confirm_cases", label: "Confirmed Cases", backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(), borderColor: window.chartColors.blue, pointRadius: 1, fill: !1, data: ydata1 };
var push_recovered = { id: "recovered_cases", label: "Recovered Cases", backgroundColor: color(window.chartColors.yellow).alpha(0.5).rgbString(), borderColor: window.chartColors.yellow, pointRadius: 1, fill: !1, data: ydata2 };
var push_death = { id: "death", label: "Deaths Cases", backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(), borderColor: window.chartColors.red, pointRadius: 1, fill: !1, data: ydata3 };
var temp = { label: series_label, backgroundColor: bg, borderColor: border, pointRadius: 1, fill: !0, data: india_time };

async function getData() {
    var e = await fetch("https://raw.githubusercontent.com/Abhaysardhara/covid19-tracker/master/views/assets/uploads/covid_19_india.csv");
    var a = await e.text();
    a = a.split("\n").splice(1).forEach((e) => {
        (e.split(",")[3] == state_name) && state.push(e);
    });
    state.forEach((e) => {
        var a = e.split(",");
        xlables.push(a[1]), ydata1.push(a[8]), ydata2.push(a[6]), ydata3.push(a[7]);
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
                { id: "confirm_cases", label: "Confirmed Cases", backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(), borderColor: window.chartColors.blue, pointRadius: 1, fill: !1, data: ydata1 },
                { id: "recovered_cases", label: "Recovered Cases", backgroundColor: color(window.chartColors.yellow).alpha(0.5).rgbString(), borderColor: window.chartColors.yellow, pointRadius: 1, fill: !1, data: ydata2 },
                { id: "death", label: "Deaths Cases", backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(), borderColor: window.chartColors.red, pointRadius: 1, fill: !1, data: ydata3 },
            ],
        },
        options: {
            responsive: !0,
            maintainAspectRatio: !1,
            title: { display: !0, text: "Corona Virus Cases Visualization" },
            scales: { xAxes: [{ display: !0, scaleLabel: { display: !0, labelString: "Date" } }], yAxes: [{ display: !0, scaleLabel: { display: !0, labelString: "Number of Cases" } }] },
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
    var e = document.getElementById("canvas").getContext("2d");
    window.myLine = new Chart(e, config);
}   
function getConfirmed() {
    config1 = {
        type: "line",
        data: { labels: xlables1, datasets: [{ label: series_label, backgroundColor: bg, borderColor: border, pointRadius: 1, fill: !0, data: india_time }] },
        options: {
            responsive: !0,
            maintainAspectRatio: !1,
            title: { display: !0, text: "India's Cases" },
            scales: { xAxes: [{ display: !0, scaleLabel: { display: !0, labelString: "Date" } }], yAxes: [{ display: !0, scaleLabel: { display: !0, labelString: "Number of " + series_label } }] },
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
    (india_time = []).length = 0;
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
    ((xlables = []).length = 0),
        ((ydata1 = []).length = 0),
        ((ydata2 = []).length = 0),
        ((ydata3 = []).length = 0),
        ((state = []).length = 0),
        (state_name = document.getElementById("states").value),
        getData().then(() => {
            (window.myLine.data.labels = xlables), (window.myLine.data.datasets[0].data = ydata1), (window.myLine.data.datasets[1].data = ydata2), (window.myLine.data.datasets[2].data = ydata3), window.myLine.update();
        });
}
getData().then(() => {
    getChart();
})
.catch((e) => {
    console.error(e);
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

document.getElementById("show_confirm_cases").addEventListener("click", function () {
    let e = !1;
    for (var a = 0; a < config.data.datasets.length; a++) "confirm_cases" == config.data.datasets[a].id && (e = !0);
    if (0 == e) {
        if ((config.data.datasets.push(push_confirm), 1 == config.data.datasets.length && (config.data.datasets[0].fill = !0), config.data.datasets.length > 1))
            for (a = 0; a < config.data.datasets.length; a++) config.data.datasets[a].fill = !1;
        window.myLine.update(), (document.getElementById("hide_confirm_cases").disabled = !1), (document.getElementById("show_confirm_cases").disabled = !0);
    }
});

document.getElementById("show_recovered_cases").addEventListener("click", function () {
    for (var e = !1, a = 0; a < config.data.datasets.length; a++) "recovered_cases" == config.data.datasets[a].id && (e = !0);
    if (0 == e) {
        if ((config.data.datasets.push(push_recovered), 1 == config.data.datasets.length && (config.data.datasets[0].fill = !0), config.data.datasets.length > 1))
            for (a = 0; a < config.data.datasets.length; a++) config.data.datasets[a].fill = !1;
        window.myLine.update(), (document.getElementById("hide_recovered_cases").disabled = !1), (document.getElementById("show_recovered_cases").disabled = !0);
    }
});

document.getElementById("show_death").addEventListener("click", function () {
    for (var e = !1, a = 0; a < config.data.datasets.length; a++) "death" == config.data.datasets[a].id && (e = !0);
    if (0 == e) {
        if ((config.data.datasets.push(push_death), 1 == config.data.datasets.length && (config.data.datasets[0].fill = !0), config.data.datasets.length > 1))
            for (a = 0; a < config.data.datasets.length; a++) config.data.datasets[a].fill = !1;
        window.myLine.update(), (document.getElementById("hide_death").disabled = !1), (document.getElementById("show_death").disabled = !0);
    }
});

document.getElementById("hide_confirm_cases").addEventListener("click", function () {
    var e;
    for (e = 0; e < config.data.datasets.length && "confirm_cases" != config.data.datasets[e].id; e++);
    config.data.datasets.splice(e, 1),
        1 == config.data.datasets.length && (config.data.datasets[0].fill = !0),
        window.myLine.update(),
        (document.getElementById("hide_confirm_cases").disabled = !0),
        (document.getElementById("show_confirm_cases").disabled = !1);
});

document.getElementById("hide_recovered_cases").addEventListener("click", function () {
    var e;
    for (e = 0; e < config.data.datasets.length && "recovered_cases" != config.data.datasets[e].id; e++);
    config.data.datasets.splice(e, 1),
        1 == config.data.datasets.length && (config.data.datasets[0].fill = !0),
        window.myLine.update(),
        (document.getElementById("hide_recovered_cases").disabled = !0),
        (document.getElementById("show_recovered_cases").disabled = !1);
});

document.getElementById("hide_death").addEventListener("click", function () {
    var e;
    for (e = 0; e < config.data.datasets.length && "death" != config.data.datasets[e].id; e++);
    config.data.datasets.splice(e, 1),
        1 == config.data.datasets.length && (config.data.datasets[0].fill = !0),
        window.myLine.update(),
        (document.getElementById("hide_death").disabled = !0),
        (document.getElementById("show_death").disabled = !1);
});
