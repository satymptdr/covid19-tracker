var xlables = [];
var ydata1 = [];
var ydata2 = [];
var ydata3 = [];
var state = [];
var config;
var state_name = 'Gujarat';
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
    var image = canvas.toDataURL("image/jpg");
    el.href = image;
};

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

function select_operation() {
    xlables.length = 0;
    ydata1.length = 0;
    ydata2.length = 0;
    ydata3.length = 0;
    state.length = 0;

    state_name = document.getElementById('states').value;

    getData().then(() => {
        push_confirm.data = ydata1;
        push_recovered.data = ydata2;
        push_death.data = ydata3;
    }).then(() => {
        getChart();
    });
}
