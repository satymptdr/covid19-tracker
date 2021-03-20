let code = sessionStorage.getItem("locality_code");

function isStateExists() {
    let sl = document.getElementById('states');
    for(let i=0; i<sl.length; ++i) {
        if(sl[i].value == code) return true;
    }
    return false;
}

var config,
    config1,
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

if(isStateExists()) {
    document.getElementById('states').value = code;
    state_name = code;
}
else {
    document.getElementById('states').value = 'GJ';
}

var state_obj = [
    { id: "confirm_cases", label: "Confirm", backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(), borderColor: window.chartColors.red, data: null},
    { id: "recovered_cases", label: "Recovered", backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(), borderColor: window.chartColors.green, data: null },
    { id: "active", label: "Active", backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(), borderColor: window.chartColors.blue, data: null },
    { id: "death", label: "Deceased", backgroundColor: color(window.chartColors.grey).alpha(0.5).rgbString(), borderColor: window.chartColors.grey, data: null },
    { id: "tested", label: "Tested", backgroundColor: color(window.chartColors.purple).alpha(0.5).rgbString(), borderColor: window.chartColors.purple, data: null },
    { id: "vaccinated", label: "Vaccinated", backgroundColor: color(window.chartColors.yellow).alpha(0.5).rgbString(), borderColor: window.chartColors.yellow, data: null }
];
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
            ydata5.push(d);
            ydata6.push(e);
            ydata4.push(a-b-c);
        });
    })

    state_obj[0].data = ydata1;
    state_obj[1].data = ydata2;
    state_obj[2].data = ydata4;
    state_obj[3].data = ydata3;
    state_obj[4].data = ydata5;
    state_obj[5].data = ydata6;
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
                { label: "Confirm", backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(), borderColor: window.chartColors.red, pointRadius: 1, fill: !1, data: ydata1 }
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
        window.myLine.data.datasets[0].data = ydata1;
        window.myLine.data.datasets[0].label = state_obj[0].label;
        window.myLine.data.datasets[0].backgroundColor = state_obj[0].backgroundColor;
        window.myLine.data.datasets[0].borderColor = state_obj[0].borderColor;
        window.myLine.update();
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

function changeData(index) {
    window.myLine.data.datasets.forEach(function(dataset) {
        dataset.label = state_obj[index].label;
        dataset.data = state_obj[index].data;
        dataset.backgroundColor = state_obj[index].backgroundColor;
        dataset.borderColor = state_obj[index].borderColor;
    });
    window.myLine.update();
}

/* add active class on click */
// Add active class to the current button (highlight it)
// var header = document.getElementById("myDIV");
// var btns = header.getElementsByClassName("btn");
// for (var i = 0; i < btns.length; i++) {
//   btns[i].addEventListener("click", function() {
//     var current = document.getElementsByClassName("active");
//     current[0].className = current[0].className.replace(" active", "");
//     this.className += " active";
//   });
// }   