const os = require('os');
process.env.UV_THREADPOOL_SIZE=os.cpus().length;
const covid = require('covid19-api');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
var bodyParser = require('body-parser');
const dotenv = require('dotenv');
var compression = require('compression');
const redis = require('redis');
const fetch = require('node-fetch')
const cheerio = require('cheerio')
var moment = require('moment');

const client = redis.createClient({
    port: 13880,
    host: 'ec2-3-95-110-113.compute-1.amazonaws.com',
    password: 'pd35a3062f2ccc06e894dd20af37a5d25dfb04f7a21fe98193032b09acc4340ba',
    tls: {
        rejectUnauthorized: false
    }
});

client.on('connect', (err, reply) => {
    if(err) {
        console.log('error redis');
    }
    console.log('redis connected');
});

client.on('error', (err) => {
    console.log('Error: ' + err);
});

dotenv.config();

// mongodb-mLab-robo 3T
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = process.env.MONGODB_URI;
const databaseName = 'covidtracker_user';

var hbs = require('hbs');
app.set('view engine', 'hbs');
app.use(compression());
app.use(express.static("public", {
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {

        if (path.match(/\.(css|png|jpg|jpeg|gif|ico|svg)$/)) {
            const date = new Date();
            date.setFullYear(date.getFullYear() + 1);
            res.setHeader("Expires", date.toUTCString());
            res.setHeader("Cache-Control", "public, max-age=345600, immutable");
        }
        if (path.match(/\.(js)$/)) {
            const date = new Date();
            date.setFullYear(date.getFullYear() + 1);
            res.setHeader("Expires", date.toUTCString());
            res.setHeader("Cache-Control", "public, max-age=172800, immutable");
        }
    }
}));
// compress all responses
app.use('/', express.static("views", {
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {

        if (path.match(/\.(css|png|jpg|jpeg|gif|ico|svg|woff)$/)) {
            const date = new Date();
            date.setFullYear(date.getFullYear() + 1);
            res.setHeader("Expires", date.toUTCString());
            res.setHeader("Cache-Control", "public, max-age=345600, immutable");
        }
        if (path.match(/\.(js)$/)) {
            const date = new Date();
            date.setFullYear(date.getFullYear() + 1);
            res.setHeader("Expires", date.toUTCString());
            res.setHeader("Cache-Control", "public, max-age=172800, immutable");
        }
    }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));

hbs.registerHelper('formatIndiaCasesTime', function (date, format) {
    return moment.unix(parseInt(moment(date, format).format("X")) - 330*60).fromNow();
});

hbs.registerHelper('formatNewsTime', function (date, format) {
    return moment(date, format).utcOffset(330).fromNow();
});

hbs.registerHelper('getTime', function (timestamp) {
    return moment.unix(timestamp).fromNow();
});

hbs.registerHelper('getDayMonth', function (timestamp, format) {
    return moment.unix(timestamp).format(format);
});

hbs.registerHelper('percent', function (cases, total) {
    return ((cases / total) * 100).toFixed(1) + '%';
});

hbs.registerHelper('calculate', function (confirm, deceased, recover) {
    let z = confirm - deceased - recover
    if(z >= 0) {
        return '+' + z;
    }
    return z;
});

hbs.registerHelper('filterZero', (value) => {
    if(value == '0' || value == 0) {
        return '';
    }
    else {
        return '+' + value;
    }
});

var arr = [];      // World Data
var arr2 = [];     // India Data
var arr4 = [];     // WHO reports
var arr5 = [];     // Civic Tracker
var total, india_total, india_new;
var results = [];   // Latest News
var arrUpdate = [];  // Latest Update


// MongoDB database connection
var db;

function connect_db() {
    MongoClient.connect(process.env.MONGODB_URI || connectionURL, { useNewUrlParser: true }, { useUnifiedTopology: true }, (error, client) => {
        if (error) {
            throw error
        }
        db = client.db(databaseName)
    });
}

connect_db();

// Web Scrapping for news
const getPostsDailyHunt = (html) => {
    let $ = cheerio.load(html)
    $('li.lang_en').each(function() {
        let a = $(this).children().children('.img')
        let left = a.children()
            let news_uri = left.attr('href')
            let news_img = left.children().attr('src')
        let right = a.next()
            let news_type = right.children('span').text()
            let news_title = right.children('span').next().children().text()
            let timeline = right.children('div.resource').children().children().next().text()
            let splitted = timeline.split(" ")
            timeline = moment().subtract(splitted[0], 'minutes').format('DD MMMM YYYY, h:mm:ss a')
        let obj = {
                title: news_title,
                uri: news_uri,
                img: news_img,
                type: news_type,
                time: timeline,
                type_given: true
            }
        results.push(obj)
    })
}

const getPageHTMLDailyHunt = () =>
  fetch('https://m.dailyhunt.in/news/india/english/corona+virus-topics-26732')
    .then(resp => resp.text())   //Promise

const getAllHTMLDailyHunt = async () => {
  getPageHTMLDailyHunt()
    .then(htmls => getPostsDailyHunt(htmls))
    .then(() => {
        server.listen(process.env.PORT || 3000, () => {
            console.log('server started at port ' + process.env.PORT);
        });
    })
}

async function get_news() {
    // await connect_db();
    await getAllHTMLDailyHunt();
}

get_news();

async function getUpdate() {
    var res = await fetch('https://api.covid19india.org/updatelog/log.json');
    var d = await res.json();
    return d;
}

getUpdate().then(res => {
    arrUpdate = [];
    arrUpdate = res;
    arrUpdate.reverse();
}).catch(e => {
    console.log(e);
});

// Routing
app.get('/', (req, res) => {
    client.get('report', (err, result) => {
        if(result) {
            arr4 = JSON.parse(result);

        }
        else {
            covid.plugins[0].situationReports().then((result) => {
                var data;
            
                for(var i=0; i<result.length; i++) {
                    if(i == 0) {
                        data = {
                            report : (result[i].report).slice(19),
                            date : result[i].date,
                            pdf : result[i].pdf,
                            new : true
                        };
                    }
                    else {
                        data = {
                            report : (result[i].report).slice(19),
                            date : result[i].date,
                            pdf : result[i].pdf,
                            new : false
                        };
                    }
                    arr4.push(data);
                }
            }).then(() => {
                client.setex('report', 1296000, JSON.stringify(arr4));
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
            res.render('index', {main : arr, report : arr4, cont: results, update: arrUpdate});
        }
        else {
            covid.plugins[0].reports().then((result) => {
                var data;
                arr.length = 0;
                for(var i=0; i < result[0].table[0].length - 1; i++) {
                        let x = result[0].table[0][i];

                        if(x.Country == 'India') {
                            india_total = x.TotalCases;
                            india_new = x.NewCases;
                        }

                        data = {
                            Country : x.Country,
                            TotalCases : x.TotalCases,
                            NewCases : x.NewCases,
                            TotalDeaths : x.TotalDeaths,
                            NewDeaths: x.NewDeaths,
                            ActiveCases: x.ActiveCases,
                            TotalTests: x.TotalTests,
                            TotalRecovered : x.TotalRecovered,
                            DeathRate : x.Deaths_1M_pop
                        };
                        arr.push(data);
                }
                arr.sort((a, b) => {
                    return b.TotalCases > a.TotalCases;
                });

            }).then(function() {
                res.render('index', {main : arr, report : arr4, cont: results,  update: arrUpdate});
                client.setex('world_data', 21600, JSON.stringify(arr));
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
            covid.plugins[0].indiaCasesByStates().then((result) => {            
                total = result[0].table[0]; 
                arr2 = result[0].table;
                arr2.shift();
                arr2.sort((a, b) => {
                    return b.confirmed - a.confirmed;
                });
                arr2.pop();
            }).then(function() {
                res.render('india', {india : arr2, total : total});
                client.setex('india_data', 900, JSON.stringify(arr2));
                client.setex('total', 900, JSON.stringify(total));
            });
        }
    });
});

app.get('/chart', (req, res) => {
    res.render('chart');
})

app.get('/news', (req, res) => {
    client.get('news', (err, result) => {
        if(result) {
            result = JSON.parse(result);
            res.render('news', {news : result});
        }
        else {
            covid.plugins[0].civicFreedomTracker().then((r) => {
                arr5 = r[0].table;
            }).then(function() {
                res.render('news', {news : arr5});
                client.setex('news', 864000, JSON.stringify(arr5));
            });
        }
    });
});

app.get('/privacy', (req, res) => {
    res.render('privacy');
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

io.on('connection', (socket) => {  
    // when the client emits 'request data', this listens and executes
    socket.on('request data', () => {
        socket.emit('answer data', {
            india_total : india_total,
            india_new : india_new
        });
    });
});

// server.listen(process.env.PORT || 3000, () => {
//     console.log('server started at port ' + process.env.PORT);
// }); 