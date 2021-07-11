const os = require('os')
process.env.UV_THREADPOOL_SIZE=os.cpus().length
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
require('dotenv').config()
const redis = require('redis')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const nodemailer = require('nodemailer')
const {civicFreedomTracker, get_news, getUpdate, situationReports,
    indiaCasesByStates, reports} = require('./Api')

/* Normalize a port into a number, string, or false. */
 function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
}

const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: normalizePort(process.env.REDIS_PORT),
    password: process.env.REDIS_PASS,
    tls: {
        rejectUnauthorized: false
    }
});

client.on('connect', (err, reply) => {
    if(err) {
        console.log('error redis');
    }
    console.log('redis connected');
}).on('error', (err) => {
    console.log('Error: ' + err);
});

// Handlebar helper registation and Express App middlewares
require('./init')(app, express);

var arr = [];      // World Data
var arr2 = [];     // India Data
var arr4 = [];     // WHO reports
var arr5 = [];     // Civic Tracker
var total, india_total, india_new, india_active, india_death, india_new_death, world_total, world_new, world_active, world_death, world_new_death;
var results  // Latest News
var arrUpdate  // Latest Update

get_news().then(data => { results = data })
getUpdate().then(data => { arrUpdate = data})

// MongoDB database connection
var db;
function connect_db() {
    MongoClient.connect(process.env.MONGODB_URI, 
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        }, 
        (error, client) => {
            if (error) {
                throw error
            }
            db = client.db(process.env.MONGODB_DATABASE)
        }
    );
}

connect_db();

// Routing
app.get('/', (req, res) => {
    client.get('report', (err, result) => {
        if(result) {
            arr4 = JSON.parse(result);
        }
        else {
            situationReports().then((result) => {
                arr4 = result;    
            }).then(() => {
                client.setex('report', 24*60*60, JSON.stringify(arr4));
            });
        }
    });

    client.get('world_data', (err, result) => {
        if(result) {
            arr.length = 0;
            arr = JSON.parse(result);

            let obj = arr.find(obj => obj.Country == 'India');
            india_total = obj.TotalCases;
            india_new = obj.NewCases == '' ? '+0' : obj.NewCases;
            india_active = obj.ActiveCases == '' ? '+0' : obj.ActiveCases;
            india_death = obj.TotalDeaths == '' ? '+0' : obj.TotalDeaths;
            india_new_death = obj.NewDeaths == '' ? '+0' : obj.NewDeaths;

            let test = arr.find(obj => obj.Country == 'World');
            world_total = test.TotalCases;
            world_new = test.NewCases == '' ? '+0' : test.NewCases;
            world_active = test.ActiveCases == '' ? '+0' : test.ActiveCases;
            world_death = test.TotalDeaths == '' ? '+0' : test.TotalDeaths;
            world_new_death = test.NewDeaths == '' ? '+0' : test.NewDeaths;

            res.render('index', {main : arr, report : arr4, cont: results, update: arrUpdate});
        }
        else {
            reports().then((result) => {
                arr.length = 0;
                for(var i=0; i < result[0].table[0].length - 1; i++) {
                        let x = result[0].table[0][i];

                        if(x.Country == 'India') {
                            india_total = x.TotalCases;
                            india_new = x.NewCases;
                            india_active = x.ActiveCases,
                            india_death = x.TotalDeaths,
                            india_new_death = x.NewDeaths
                        }
                        else if(x.Country == 'World') {
                            world_total = x.TotalCases;
                            world_new = x.NewCases;
                            world_active = x.ActiveCases,
                            world_death = x.TotalDeaths,
                            world_new_death = x.NewDeaths
                        }

                        arr.push({
                            Country : x.Country,
                            TotalCases : x.TotalCases,
                            NewCases : x.NewCases,
                            TotalDeaths : x.TotalDeaths,
                            NewDeaths: x.NewDeaths,
                            ActiveCases: x.ActiveCases,
                            TotalTests: x.TotalTests,
                            TotalRecovered : x.TotalRecovered,
                            DeathRate : x.Deaths_1M_pop
                        });
                }
                arr.sort((a, b) => {
                    return b.TotalCases > a.TotalCases;
                });

            }).then(function() {
                res.render('index', {main : arr, report : arr4, cont: results,  update: arrUpdate});
                client.setex('world_data', 60*60, JSON.stringify(arr));
            });
        }
    });
});

app.get('/app-calendar', (req, res) => {
    res.render('app-calendar');
});

app.get('/india', (req, res) => {
    var total_data;
    client.get('total', (err, r) => {
        if(r) {
            total_data = JSON.parse(r);
        }
    });

    client.get('india_data', (err, result) => {
        if(result) {
            result = JSON.parse(result);
            result.pop();
            res.render('india', {india : result, total : total_data});
        }
        else {
            indiaCasesByStates().then((result) => {
                total = result[0]; 
                arr2 = result;
                arr2.shift();
                arr2.sort((a, b) => {
                    return b.confirmed - a.confirmed;
                });
                arr2.pop();
            }).then(function() {
                res.render('india', {india : arr2, total : total});
                client.setex('india_data', 10*60, JSON.stringify(arr2));
                client.setex('total', 10*60, JSON.stringify(total));
            });
        }
    });
});

app.get('/chart', (req, res) => {
    res.render('chart');
})

app.get('/news', (req, res) => {
    client.get('civic', (err, result) => {
        if(result) {
            result = JSON.parse(result);
            res.render('news', {news : result});
        }
        else {
            civicFreedomTracker().then((r) => {
                arr5.length = 0;
                arr5 = r[0].table;
            }).then(function() {
                res.render('news', {news : arr5});
                client.setex('civic', 5*24*60*60, JSON.stringify(arr5));
            });
        }
    });
});

app.get('/privacy', (req, res) => {
    res.render('privacy');
});

app.get('/contactus', (req, res) => {
    res.render('contactus');
});

app.post('/userContact', (req, res) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });
    let myObj = {
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.text,
        timestamp: new Date(Date.now()).toLocaleString()
    };

    var mailOptions = {
        from: 'abhaysardharaa@gmail.com',
        to: req.body.email,
        subject: 'Covid19 Tracker - We received your response',
        text: 'Hello ' + req.body.name + '. Thank you for your response. We will shortly communicate with you.\n\n Stay Safe.'
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    db.collection("userContact").insertOne(myObj, (err, res) => {
        if(err) {
            throw err;
        }
        console.log(res);
    });
    res.render('contactus');
})

app.get('/abhay/contact', (req, res) => {
    db.collection("userContact").find({}).toArray((err, result) => {
        if(err) {
            throw err;
        }
        res.render('contact', {message : result});
    });
});

app.post('/abhay/data', (req, res) => {
    let myObj = {
        ip: req.body.ip,
        city: req.body.city,
        state: req.body.state,
        region_code: req.body.region_code,
        country: req.body.country,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        telecome: req.body.telecome,
        postal: req.body.postal,
        timestamp: req.body.timestamp
    };

    db.collection("user_data").insertOne(myObj, (err, res) => {
        if(err) {
            throw err;
        }
    });
});

app.get('/abhay/data', (req, res) => {
    db.collection("user_data").find({}).toArray((err, result) => {
        if(err) {
            throw err;
        }
        res.render('data', {user : result});
    });
});

app.get('/Api/getNews', (req, res) => {
    client.get('civic', (err, result) => {
        if(result) {
            res.json(result);
        }
        else {
            get_news().then(data => res.json(data))
        }
    });
})

app.get('/Api/civicFreedomTracker', (req, res) => {
    civicFreedomTracker().then(data => res.json(data))
})

app.get('/Api/ ', (req, res) => {
    situationReports().then(data => res.json(data))
})
app.get('/Api/worldData', (req, res) => {
    client.get('world_data', (err, result) => {
        if(result) {
            res.json(result);
        }
        else {
            reports().then(data => res.json(data))
        }
    });
})

io.on('connection', (socket) => {  
    // when the client emits 'request data', this listens and executes
    socket.on('request data', () => {
        socket.emit('answer data', {
            india_total : india_total,
            india_new : india_new
        });
    });

    socket.on('bot_data_request', () => {
        socket.emit('bot_data_answer', {
            india_total : india_total,
            india_new : india_new,
            india_active : india_active,
            india_death : india_death,
            india_new_death : india_new_death,
            world_total : world_total,
            world_new : world_new,
            world_active : world_active,
            world_death : world_death,
            world_new_death : world_new_death
        });
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('server started at port ' + process.env.PORT);
});