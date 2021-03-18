var config,
    config1,
    xlables = [],
    xlables1 = [],
    ydata1 = [],
    ydata2 = [],
    ydata3 = [],
    ydata4 = [],
    india_time = [],
    state_name = "GJ",
    color = Chart.helpers.color,
    series_label = "Confirmed Cases",
    bg = color(window.chartColors.blue).alpha(0.5).rgbString(),
    border = window.chartColors.blue;

// var push_confirm = { id: "confirm_cases", label: "Confirmed Cases", backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(), borderColor: window.chartColors.blue, pointRadius: 1, fill: !1, data: ydata1 };
// var push_recovered = { id: "recovered_cases", label: "Recovered Cases", backgroundColor: color(window.chartColors.yellow).alpha(0.5).rgbString(), borderColor: window.chartColors.yellow, pointRadius: 1, fill: !1, data: ydata2 };
// var push_death = { id: "death", label: "Deaths Cases", backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(), borderColor: window.chartColors.red, pointRadius: 1, fill: !1, data: ydata3 };
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

    var a,b,c;
    Object.keys(data[state_name]).map(i => {
        xlables.forEach(ele => {
            a = data[state_name][i][ele]['total']['confirmed'] || !0;
            b = data[state_name][i][ele]['total']['recovered'] || !0;
            c = data[state_name][i][ele]['total']['deceased'] || !0;
            ydata1.push(a);
            ydata2.push(b);
            ydata3.push(c);
            ydata4.push(a-b-c);
        });
    })
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
                { id: "confirm_cases", label: "Confirm", backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(), borderColor: window.chartColors.red, pointRadius: 1, fill: !1, data: ydata1 },
                { id: "recovered_cases", label: "Recovered", backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(), borderColor: window.chartColors.green, pointRadius: 1, fill: !1, data: ydata2 },
                { id: "death", label: "Deceased", backgroundColor: color(window.chartColors.grey).alpha(0.5).rgbString(), borderColor: window.chartColors.grey, pointRadius: 1, fill: !1, data: ydata3 },
                { id: "active", label: "Active", backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(), borderColor: window.chartColors.blue, pointRadius: 1, fill: !1, data: ydata4 },
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
	
    state_name = document.getElementById('states').value;

    getData().then(() => {
        window.myLine.data.labels = xlables;
        window.myLine.data.datasets[0].data = ydata1;
        window.myLine.data.datasets[1].data = ydata2;
        window.myLine.data.datasets[2].data = ydata3;
        window.myLine.data.datasets[3].data = ydata4;
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

// document.getElementById('show_confirm_cases').addEventListener('click', function() {
//     let available = false;
//     for(var i = 0; i < config.data.datasets.length; i++) {
//         if(config.data.datasets[i].id == 'confirm_cases') {
//             available = true;
//         }
//     }
    
//     if(available == false) {
//         config.data.datasets.push(push_confirm);

//         if(config.data.datasets.length == 1) {
//             config.data.datasets[0].fill = true;
//         }

//         if(config.data.datasets.length > 1) {
//             for(var i=0; i<config.data.datasets.length; i++) {
//                 config.data.datasets[i].fill = false;
//             }
//         }

//         window.myLine.update();
//         document.getElementById('hide_confirm_cases').disabled = false;
//         document.getElementById('show_confirm_cases').disabled = true;
//     }
// });

// document.getElementById('show_recovered_cases').addEventListener('click', function() {
//     var available = false;
//     for(var i = 0; i < config.data.datasets.length; i++) {
//         if(config.data.datasets[i].id == 'recovered_cases') {
//             available = true;
//         }
//     }
    
//     if(available == false) {
//         config.data.datasets.push(push_recovered);

//         if(config.data.datasets.length == 1) {
//             config.data.datasets[0].fill = true;
//         }

//         if(config.data.datasets.length > 1) {
//             for(var i=0; i<config.data.datasets.length; i++) {
//                 config.data.datasets[i].fill = false;
//             }
//         }

//         window.myLine.update();
//         document.getElementById('hide_recovered_cases').disabled = false;
//         document.getElementById('show_recovered_cases').disabled = true;
//     }
    
// });

// document.getElementById('show_death').addEventListener('click', function() {
//     var available = false;
//     for(var i = 0; i < config.data.datasets.length; i++) {
//         if(config.data.datasets[i].id == 'death') {
//             available = true;
//         }
//     }
    
//     if(available == false) {
//         config.data.datasets.push(push_death);

//         if(config.data.datasets.length == 1) {
//             config.data.datasets[0].fill = true;
//         }

//         if(config.data.datasets.length > 1) {
//             for(var i=0; i<config.data.datasets.length; i++) {
//                 config.data.datasets[i].fill = false;
//             }
//         }

//         window.myLine.update();
//         document.getElementById('hide_death').disabled = false;
//         document.getElementById('show_death').disabled = true;
//     } 
// });

// document.getElementById('hide_confirm_cases').addEventListener('click', function() {
//     var i;
//     for(i = 0; i < config.data.datasets.length; i++) {
//         if(config.data.datasets[i].id == 'confirm_cases') {
//             break;
//         }
//     }
//     config.data.datasets.splice(i, 1);

//     if(config.data.datasets.length == 1) {
//         config.data.datasets[0].fill = true;
//     }

//     window.myLine.update();
//     document.getElementById('hide_confirm_cases').disabled = true;
//     document.getElementById('show_confirm_cases').disabled = false;
// });

// document.getElementById('hide_recovered_cases').addEventListener('click', function() {
//     var i;
//     for(i = 0; i < config.data.datasets.length; i++) {
//         if(config.data.datasets[i].id == 'recovered_cases') {
//             break;
//         }
//     }
    
//     config.data.datasets.splice(i, 1);

//     if(config.data.datasets.length == 1) {
//         config.data.datasets[0].fill = true;
//     }

//     window.myLine.update();
//     document.getElementById('hide_recovered_cases').disabled = true;
//     document.getElementById('show_recovered_cases').disabled = false;
// });

// document.getElementById('hide_death').addEventListener('click', function() {
//     var i;
//     for(i = 0; i < config.data.datasets.length; i++) {
//         if(config.data.datasets[i].id == 'death') {
//             break;
//         }
//     }
//     config.data.datasets.splice(i, 1);

//     if(config.data.datasets.length == 1) {
//         config.data.datasets[0].fill = true;
//     }

//     window.myLine.update();
//     document.getElementById('hide_death').disabled = true;
//     document.getElementById('show_death').disabled = false;
// });