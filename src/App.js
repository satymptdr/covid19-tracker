const os = require('os');
process.env.UV_THREADPOOL_SIZE=os.cpus().length;
const covid = require('covid19-api');
const express = require('express');
const app = express();
const path = require('path');
var bodyParser = require('body-parser');
const dotenv = require('dotenv');
var compression = require('compression');
const redis = require('redis');
const fetch = require('node-fetch')
const cheerio = require('cheerio')
var moment = require('moment')

var client = redis.createClient({
    port      : PORT,
    host      : HOST,
    password  : PASSWORD
});

client.on('connect', (err, reply) => {
    if(err) {
        console.log('error redis');
    }
    console.log('redis connected');
});

dotenv.config();

// mongodb-mLab-robo 3T
// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient

// const connectionURL = 'mongodb://127.0.0.1:27017'
// const databaseName = DBNAME
// const databaseName = 'admin'

var hbs = require('hbs');
app.set('view engine', 'hbs');
app.use(compression());
app.use(express.static("public", {
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {

        if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
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
            res.setHeader("Cache-Control", "public, max-age=172800, immutable");
        }
    }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));


var arr = [];      // World Data
var arr2 = [];     // India Data
var arr4 = [];     // WHO reports
var arr5 = [];     // Civic Tracker
var total;
var results = [];   // Latest News


// MongoDB database connection
// var db;

// function connect_db() {
//     MongoClient.connect(process.env.MONGODB_URI || connectionURL, { useNewUrlParser: true }, { useUnifiedTopology: true }, (error, client) => {
//         if (error) {
//             throw error
//         }
//         db = client.db(databaseName)
//     });
// }

async function get_news() {
    // await connect_db();
    await getAllHTMLDailyHunt();
}


// Web Scrapping for news
const getPostsDailyHunt = (html) => {
    let $ = cheerio.load(html)
    $('li.lang_hi').each(function() {
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
        if(obj.title != '' ) {
            results.push(obj)
        }
    })
}

const getPageHTMLDailyHunt = () =>
  fetch(`https://m.dailyhunt.in/news/india/hindi`)
    .then(resp => resp.text())   //Promise

const getAllHTMLDailyHunt = async () => {
  getPageHTMLDailyHunt()
    .then(htmls => getPostsDailyHunt(htmls))
}

get_news();

// Routing
app.get('/', (req, res) => {
    console.log(req.ipInfo);
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
                client.setex('report', parseInt((new Date().setHours(23, 59, 59, 999)-new Date())/1000), JSON.stringify(arr4));
            });
        }
    });

    // db.collection("news").find({}).sort({"time": -1}).limit(50).toArray((err, result) => {
    //     if(err) {
    //         throw err
    //     }
    //     cont = result        
    // })

    client.get('world_data', (err, result) => {
        if(result) {
            arr = JSON.parse(result);
            res.render('index', {main : arr, report : arr4, cont: results});
        }
        else {
            covid.plugins[0].reports().then((result) => {
                var data;
                for(var i=0; i < result[0].table[0].length - 1; i++) {
                        let x = result[0].table[0][i];

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
                    return b.TotalCases - a.TotalCases;
                });
            }).then(function() {
                res.render('index', {main : arr, report : arr4, cont: results});
                client.setex('world_data', 21600, JSON.stringify(arr));
            });
        }
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('server started at port ' + process.env.PORT);
}); 

app.get('/app-calendar', (req, res) => {
    res.render('app-calendar');
});

app.get('/india', (req, res) => {

    var total_data;

    client.get('total', (err, r) => {
        if(r) {
            total_data = JSON.parse(r);
            india_total = total_data.confirmed;
            india_new = total_data.deltaconfirmed;
        }
    });

    client.get('india_data', (err, result) => {
        if(result) {
            result = JSON.parse(result);
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
            }).then(function() {
                res.render('india', {india : arr2, total : total});
                client.setex('india_data', 21600, JSON.stringify(arr2));
                client.setex('total', 21600, JSON.stringify(total));
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

// var myMid;
// function binary_Search(elToFind) {
//     var lowIndex = 0;
//     var highIndex = arr.length - 1;
//     while (lowIndex <= highIndex) {
//       var midIndex = Math.floor((lowIndex + highIndex) / 2);
//       console.log(arr[midIndex].Country.toLowerCase());
//       if ((arr[midIndex].Country.toLowerCase()) == elToFind) {
//           console.log('Finally : ' + arr[midIndex].Country.toLowerCase() + ' ' + elToFind);
//         myMid = midIndex;
//       } else if ((arr[midIndex].Country.toLowerCase()) < elToFind) {
//         lowIndex = midIndex + 1;
//       } else {
//         highIndex = midIndex - 1;
//       }
//     }
//     return -1;
//   }

// app.post('/send_post_data', (req, res) => {
//     binary_Search(req.body.country.toLowerCase());
//     // io.on('connection', (socket) => {
//     //     const message = JSON.stringify({ title: "Live Corona Cases", body: `India Total : ${total_india} \n India New : ${new_india} \n Gujarat Total : ${total_gujarat} \n Gujarat New : +${new_gujarat}`, icon: "image/notification.png"});
//     //     socket.emit('sendOnVisit', message);
//     // });
// });

app.get('/privacy', (req, res) => {
    res.render('privacy');
});

// app.get('/file_upload', (req, res) => {
//     res.render('file_upload');
// });

// app.get('/chart/delete', (req, res) => {
//     var fs = require('fs');

//     fs.readdir('./views/assets/uploads', (err, files) => {
//         if(err) {
//             throw err;
//         }

//         if ((fs.existsSync('./views/assets/uploads/covid_19_india.csv')) && files.length == 1) {
//             fs.unlink('./views/assets/uploads/covid_19_india.csv', (err) => {
//                 if(err) 
//                 {
//                     res.render('file_upload', {message: 'File Not Deleted!'});
//                 }
//                 res.render('file_upload', {message: 'File Deleted Successfully'});
//             });
//         }
//         else if(files.length == 0) {
//             res.render('file_upload', {message: 'There is no any file on location!'});
//         }
//         else {
//             res.render('file_upload', {message: 'There is some error!'});
//         }

//     })

// });

// app.post('/chart/update', (req, res) => {

//     var fs = require('fs');
//     const formidable = require('formidable');

//     if (req.url == '/chart/update') {
//         var form = new formidable.IncomingForm();

//         form.parse(req);

//         form.on('fileBegin', function (name, file){
//             file.path = path.join(__dirname , '../views/assets/uploads/covid_19_india.csv');
//         });

//         form.on('file', function (name, file){
//             res.render('file_upload', {message : 'File Uploaded'});
//         });
//     }
// });

// app.post('/abhay/data', async function(req, res, next) {
//     obj = {
//         state : req.body.state,
//         country : req.body.country,
//         timestamp : req.body.timestamp
//     };
//     console.log(obj);
// });

// app.get('/abhay/data', (req, res) => {
//     console.log(obj);
// });
