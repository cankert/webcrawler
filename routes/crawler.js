var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var responseCode = '';
var responseTime = '';

router.get('/scrape/', function(req,res){
    //var pageToVisit = req.data;

    console.log('1. /scrape got called, starting Crawl');
    var websiteToCrawl = req.query.website;
    var entryToUpdate = req.query.id;
    var db = req.db;
    var collection = db.get('websitelist');

    console.log('2. Starting Crawl for this Website: ' + websiteToCrawl);

    function getStatusCode(){
        request.get({
            url: websiteToCrawl,
            time: true
        },function(err,response){
            responseCode = response.statusCode;
            responseTime = response.elapsedTime;

            console.log('3. Visiting Website ' + websiteToCrawl);
            console.log('4. Status code of Website: ' + responseCode);
            console.log('5. Response Time: ' + responseTime + 'ms');

        });
    }

    function updateDbEntry(){
        console.log('6. Starting db update for "' + entryToUpdate + '"');

        collection.update(
            { "_id" : entryToUpdate },
            { "$set" : { 'status' : responseCode, 'responsetime' : responseTime } },
            { "upsert" : true }
        );
        console.log('7. Success on Update');

    }

    getStatusCode();
    updateDbEntry();
    res.send();

});

module.exports = router;
