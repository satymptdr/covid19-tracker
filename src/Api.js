const fetch = require('node-fetch')
const cheerio = require('cheerio')
const tabletojson = require('tabletojson').Tabletojson;
const WHO_BASE_URL = 'https://www.who.int';
const BASE_URL = 'https://www.worldometers.info';

const renameKey = (obj, old_key, new_key) => {
    if (old_key !== new_key) {
      Object.defineProperty(obj, new_key,
        Object.getOwnPropertyDescriptor(obj, old_key));
      delete obj[old_key];
    }
};

// Scrapping Civic Freedom Tracker
const civicFreedomTracker = async () =>{
    const res = await fetch('https://www.icnl.org/covid19tracker/')
    const body = await res.text();
    const $ = cheerio.load(body);
    
    const promises = [];
  
    $('div#entries div.entry').each((index, element) =>{
        const $element = $(element);
        const country = $element.find('div.entrypretitle').text().trim();
        const title = $element.find('h3').text().trim();
        const type = $element.find('span.order').text().trim();
        const date = $element.find('span.date').text().trim().substr(11);
        const issue = $element.find('span.issue').text().trim().substr(10);
        const description = $element.find('p').text().trim().split("\n")[0];

        promises.push({country, title, description, type, date, issue});
    });
  
    const table = [{table: promises}];
  
    return Promise.all(table);
};

// Web Scrapping for news
const get_news = async () => {
    const result = await fetch('https://www.livemint.com/Search/Link/Keyword/covid')
    const body = await result.text();
    const $ = cheerio.load(body);

    const promises = [];

    $('div.listtostory').each(function() {
        let left = $(this).children()
        let news_uri = 'https://www.livemint.com' + left.children().attr('href')
        let news_img  = left.children().children().attr('src')
        let news_type = 'Covid News'
        let a = left.next().children().children().text().replace(/^\s+|\s+$/gm,'').split('\n')
        let obj = {
            title: a[0],
            uri: news_uri,
            img: news_img,
            type: news_type,
            time: a[1].split('.')[1].slice(0,8)
        }
        if(obj.title != '') {
            promises.push(obj);
        }
    })

    return Promise.all(promises)
}

const getUpdate = async () => {
    var response = await fetch('https://api.covid19india.org/updatelog/log.json');
    var data = await response.json();
    return Promise.all(data.reverse());
}

const situationReports = async() =>{
    const res = await fetch(`${WHO_BASE_URL}/emergencies/diseases/novel-coronavirus-2019/situation-reports`);
    const body = await res.text();
    const $ = cheerio.load(body);   
    const doc = [];

    $('a.sf-meeting-report-list__item').each((index , element) =>{
        const $element = $(element);
        const date = $element.find('div').children().text();
        const pdf = $element.attr('href');
        doc.push({
            index: index,
            date: date,
            pdf: pdf
        })
    })

    return Promise.all(doc);
};

const indiaCasesByStates = async () =>{
    const res = await fetch('https://api.covid19india.org/data.json');
    const data = await res.json();

    return Promise.all(data.statewise);
}

const reports = async () =>{
    const res = await fetch(`${BASE_URL}/coronavirus`)
    const body = await res.text();
    const $ = cheerio.load(body);
    const html = $.html();
    const data = [];

    const tempCases = $('div#maincounter-wrap').eq(0).text().split(':')[1].trim();
    const cases = parseInt(tempCases.replace(/,/g , '') , 10);
    const tempDeaths = $('div#maincounter-wrap').eq(1).text().split(':')[1].trim();
    const deaths = parseInt(tempDeaths.replace(/,/g , '') , 10);
    const tempRecovered = $('div#maincounter-wrap').eq(2).text().split(':')[1].trim();
    const recovered = parseInt(tempRecovered.replace(/,/g , '') , 10);

    const table = tabletojson.convert(html);  

    const activeCases = [];
    const closedCases = [];

    $('div .col-md-6').eq(0).each((index , element) =>{
        const $element = $(element);
        const tempInfected = $element.find('div.number-table-main').text();
        const infected = parseInt(tempInfected.replace(/,/g , '') , 10);
        const tempInMidCondition = $element.find('span.number-table').eq(0).text();
        const inMidCondition = parseInt(tempInMidCondition.replace(/,/g , '') , 10);
        const tempCritical = $element.find('span.number-table').eq(1).text();
        const criticalStates = parseInt(tempCritical.replace(/,/g , '') , 10);

        activeCases.push({
            currently_infected_patients: infected,
            inMidCondition: inMidCondition,
            criticalStates: criticalStates
        });
    });

    $('div .col-md-6').eq(1).each((index , element) =>{
        const $element = $(element);
        const infected = $element.find('div.number-table-main').text();
        const cases_which_had_an_outcome = parseInt(infected.replace(/,/g , '') , 10);
        const tempRecovered = $element.find('span.number-table').eq(0).text();
        const recovered = parseInt(tempRecovered.replace(/,/g , '') , 10);
        const tempDeaths = $element.find('span.number-table').eq(1).text();
        const deaths = parseInt(tempDeaths.replace(/,/g , '') , 10);

        closedCases.push({
            cases_which_had_an_outcome: cases_which_had_an_outcome,
            recovered: recovered,
            deaths: deaths
        });
    });

    data.push({
        cases: cases,
        deaths: deaths,
        recovered: recovered,
        active_cases: activeCases,
        closed_cases: closedCases,
        table: table
    });

    data[0].table.map(doc =>{
        doc.forEach((obj) => renameKey(obj , 'Deaths/1M pop' , 'Deaths_1M_pop'));
        doc.forEach((obj) => renameKey(obj , 'Country,Other' , 'Country'));
        doc.forEach((obj) => renameKey(obj , 'Serious,Critical' , 'Serious_Critical'));
        doc.forEach((obj) => renameKey(obj , 'Tests/\n1M pop' , 'Tests_1M_Pop'));
        doc.forEach((obj) => renameKey(obj , 'Tot Cases/1M pop' , 'TotCases_1M_Pop'));
    });

    return Promise.all(data);
};

module.exports = {
    civicFreedomTracker,
    get_news,
    getUpdate,
    situationReports,
    indiaCasesByStates,
    reports
};