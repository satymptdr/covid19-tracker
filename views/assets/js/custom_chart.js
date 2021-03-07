var xlables = [];
var xlables1 = [];
var ydata1 = [];
var ydata2 = [];
var ydata3 = [];
var state = [];
var india_time = [];
var config, config1;
var state_name = 'Gujarat';
var series_label, bg, border;
var color = Chart.helpers.color;

var push_confirm = {
                id: 'confirm_cases',
                label: 'Confirmed Cases',
                backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                borderColor: window.chartColors.blue,
                pointRadius: 1,
                fill: false,
                data: ydata1
            };

var push_recovered = {
                id: 'recovered_cases',
                label: 'Recovered Cases',
                backgroundColor: color(window.chartColors.yellow).alpha(0.5).rgbString(),
                borderColor: window.chartColors.yellow,
                pointRadius: 1,
                fill: false,
                data: ydata2 
            };

var push_death = {
                id: 'death',
                label: 'Deaths Cases',
                backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                borderColor: window.chartColors.red,
                pointRadius: 1,
                fill: false,
                data: ydata3
            };

getData().then(() => {
    getChart();
}).catch((e) => {
    console.error(e);
});

async function getData() {
    var response = await fetch('assets/uploads/covid_19_india.csv');
    var data = await response.text();

    data = data.split('\n').splice(1);

    data.forEach((ele) => {
        var row = ele.split(',');
        if(row[3] == state_name) {
            state.push(ele);
        }
    });

    state.forEach(ele => {
        var row = ele.split(',');
        xlables.push(row[1]);
        ydata1.push(row[8]);
        ydata2.push(row[6]);
        ydata3.push(row[7]);
    });
}

timeSeries().then(() => {
    getConfirmed();
}).catch((e) => {
    console.log(e);
});

async function timeSeries(type='https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv') {
    var response = await fetch(type);
    var data = await response.text();

    let data1 = data.split('\n');
    xlables1 = data1[0].split(',').splice(4);
    data1 = data1.splice(1);
    let left=0, right=data1.length-1, mid;

    while(left <= right) {
        mid = Math.floor((left + right)/2)
        let s_row = data1[mid].split(',');
        if(s_row[1] == "India") {
            break;
        }
        else if(s_row[1] < "India") {
            left = mid+1;
        }
        else { 
            right = mid-1;
        }
    }
    india_time =  data1[mid].split(',').splice(4);
    if(type.substring(130) == 'confirmed_global.csv') {
        series_label = 'Confirmed Cases';
        bg = color(window.chartColors.blue).alpha(0.5).rgbString();
        border = window.chartColors.blue;
    }
    else if(type.substring(130) == 'recovered_global.csv') {
        series_label = 'Recovered Cases';
        bg = color(window.chartColors.yellow).alpha(0.5).rgbString();
        border = window.chartColors.yellow;
    }
    else {
        series_label = 'Death Cases';
        bg = color(window.chartColors.red).alpha(0.5).rgbString();
        border = window.chartColors.red;
    }
}

function getChart() {
    config = {
        type: 'line',
        data: {
            labels: xlables,
            datasets: [{
                id: 'confirm_cases',
                label: 'Confirmed Cases',
                backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                borderColor: window.chartColors.blue,
                pointRadius: 1,
                fill: false,
                data: ydata1
            },
            {
                id: 'recovered_cases',
                label: 'Recovered Cases',
                backgroundColor: color(window.chartColors.yellow).alpha(0.5).rgbString(),
                borderColor: window.chartColors.yellow,
                pointRadius: 1,
                fill: false,
                data: ydata2 
            },
            {
                id: 'death',
                label: 'Deaths Cases',
                backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                borderColor: window.chartColors.red,
                pointRadius: 1,
                fill: false,
                data: ydata3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Corona Virus Cases Visualization'
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }                            
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of Cases'
                    }
                }]
            },
            tooltips: {
                intersect: false,
                mode: 'index',
                callbacks: {
                    label: function(tooltipItem, myData) {
                        var label = myData.datasets[tooltipItem.datasetIndex].label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += tooltipItem.value;
                        return label;
                    }
                }
            }
        }
    };

    
    var ctx = document.getElementById('canvas').getContext('2d');
    window.myLine = new Chart(ctx, config);
    
}

download_img = function(el) {
    let canvas = document.getElementById("canvas");
    var image = canvas.toDataURL("image/jpg");
    el.href = image;
};

download_img1 = function(el) {
    let canvas1 = document.getElementById("canvas1");
    var image = canvas1.toDataURL("image/jpg");
    el.href = image;
};

function getConfirmed() {
    config1 = {
        type: 'line',
        data: {
            labels: xlables1,
            datasets: [{
                label: series_label,
                backgroundColor: bg,
                borderColor: border,
                pointRadius: 1,
                fill: true,
                data: india_time
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'India\'s Cases'
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }                            
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of ' + series_label
                    }
                }]
            },
            tooltips: {
                intersect: false,
                mode: 'index',
                callbacks: {
                    label: function(tooltipItem, myData) {
                        var label = myData.datasets[tooltipItem.datasetIndex].label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += tooltipItem.value;
                        return label;
                    }
                }
            }
        }
    };

    
    var ctx = document.getElementById('canvas1').getContext('2d');
    window.myLine1 = new Chart(ctx, config1);
}

document.getElementById('show_confirm_cases').addEventListener('click', function() {
    let available = false;
    for(var i = 0; i < config.data.datasets.length; i++) {
        if(config.data.datasets[i].id == 'confirm_cases') {
            available = true;
        }
    }
    
    if(available == false) {
        config.data.datasets.push(push_confirm);

        if(config.data.datasets.length == 1) {
            config.data.datasets[0].fill = true;
        }

        if(config.data.datasets.length > 1) {
            for(var i=0; i<config.data.datasets.length; i++) {
                config.data.datasets[i].fill = false;
            }
        }

        window.myLine.update();
        document.getElementById('hide_confirm_cases').disabled = false;
        document.getElementById('show_confirm_cases').disabled = true;
    }
});

document.getElementById('show_recovered_cases').addEventListener('click', function() {
    var available = false;
    for(var i = 0; i < config.data.datasets.length; i++) {
        if(config.data.datasets[i].id == 'recovered_cases') {
            available = true;
        }
    }
    
    if(available == false) {
        config.data.datasets.push(push_recovered);

        if(config.data.datasets.length == 1) {
            config.data.datasets[0].fill = true;
        }

        if(config.data.datasets.length > 1) {
            for(var i=0; i<config.data.datasets.length; i++) {
                config.data.datasets[i].fill = false;
            }
        }

        window.myLine.update();
        document.getElementById('hide_recovered_cases').disabled = false;
        document.getElementById('show_recovered_cases').disabled = true;
    }
    
});

document.getElementById('show_death').addEventListener('click', function() {
    var available = false;
    for(var i = 0; i < config.data.datasets.length; i++) {
        if(config.data.datasets[i].id == 'death') {
            available = true;
        }
    }
    
    if(available == false) {
        config.data.datasets.push(push_death);

        if(config.data.datasets.length == 1) {
            config.data.datasets[0].fill = true;
        }

        if(config.data.datasets.length > 1) {
            for(var i=0; i<config.data.datasets.length; i++) {
                config.data.datasets[i].fill = false;
            }
        }

        window.myLine.update();
        document.getElementById('hide_death').disabled = false;
        document.getElementById('show_death').disabled = true;
    }
    
});

document.getElementById('hide_confirm_cases').addEventListener('click', function() {
    var i;
    for(i = 0; i < config.data.datasets.length; i++) {
        if(config.data.datasets[i].id == 'confirm_cases') {
            break;
        }
    }
    config.data.datasets.splice(i, 1);

    if(config.data.datasets.length == 1) {
        config.data.datasets[0].fill = true;
    }

    window.myLine.update();
    document.getElementById('hide_confirm_cases').disabled = true;
    document.getElementById('show_confirm_cases').disabled = false;
});

document.getElementById('hide_recovered_cases').addEventListener('click', function() {
    var i;
    for(i = 0; i < config.data.datasets.length; i++) {
        if(config.data.datasets[i].id == 'recovered_cases') {
            break;
        }
    }
    
    config.data.datasets.splice(i, 1);

    if(config.data.datasets.length == 1) {
        config.data.datasets[0].fill = true;
    }

    window.myLine.update();
    document.getElementById('hide_recovered_cases').disabled = true;
    document.getElementById('show_recovered_cases').disabled = false;
});

document.getElementById('hide_death').addEventListener('click', function() {
    var i;
    for(i = 0; i < config.data.datasets.length; i++) {
        if(config.data.datasets[i].id == 'death') {
            break;
        }
    }
    config.data.datasets.splice(i, 1);

    if(config.data.datasets.length == 1) {
        config.data.datasets[0].fill = true;
    }

    window.myLine.update();
    document.getElementById('hide_death').disabled = true;
    document.getElementById('show_death').disabled = false;
});

function Select_Type() {
    india_time = [];
    india_time.length = 0;

    let type = document.getElementById('type').value;

    timeSeries(type).then(() => {
        getConfirmed();
    });
}


function select_operation() {
    xlables = [];
    ydata1 = [];
    ydata2 = [];
    ydata3 = [];
    state = [];

    state_name = document.getElementById('states').value;

    getData().then(() => {
        push_confirm.data = ydata1;
        push_recovered.data = ydata2;
        push_death.data = ydata3;
    }).then(() => {
        getChart();
    });
}
