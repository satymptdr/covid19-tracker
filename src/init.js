var hbs = require('hbs');
var moment = require('moment');
var compression = require('compression');
var bodyParser = require('body-parser');
const path = require('path');

module.exports = function(app, express) {
    hbs.registerHelper('formatIndiaCasesTime', function (date) {
        return moment(date).startOf('hour').fromNow();
    });

    hbs.registerHelper('formatTop10NewsTime', function (date, format) {
        return moment.unix(parseInt(moment(date, format).format("X"))).fromNow();
    });
    
    hbs.registerHelper('getTime', function (timestamp) {
        return moment.unix(timestamp).fromNow();
    });
    
    hbs.registerHelper('check', function (timestamp) {
        if(moment.unix(timestamp).format('D') === moment().format('D')) {
            return true;
        }
        return false;
    });
    
    hbs.registerHelper('getDayMonth', function (timestamp, format) {
        return moment.unix((parseInt(timestamp))).format(format);
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

    hbs.registerHelper('isNew', (index) => {
        return index==0;
    });

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
}