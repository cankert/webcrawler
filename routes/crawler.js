var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var _ = require('lodash');

// Routings ===================================================================================

router.get('/scrape/', function(req,res){


    var entryToUpdate = req.query.id;
    var websiteToCrawl = req.query.website;

    getStatusCode(req,websiteToCrawl, entryToUpdate);

    res.send();
});

router.get('/crawl/', function(req,res){

    crawlAll(req);

    res.send();
});

// Functions ====================================================================================

function getStatusCode(req,websiteToCrawl, entryToUpdate){
    request.get({
        url: websiteToCrawl,
        time: true
    },function(err,response){
        var responseCode = response.statusCode;
        var responseTime = response.elapsedTime;

        console.log('1. /scrape got called, starting Crawl');
        console.log('2. Starting Crawl for this Website: ' + websiteToCrawl);
        console.log('3. Visiting Website ' + websiteToCrawl);
        console.log('4. Status code of Website: ' + responseCode);
        console.log('5. Response Time: ' + responseTime + 'ms');

        updateDbEntry(req,responseCode,responseTime, entryToUpdate);
    });
}

function updateDbEntry(req,responseCode,responseTime, entryToUpdate){
    var db = req.db;
    var collection = db.get('crawl');
    var currentDate = Date.now();

    console.log('6. Starting db update for "' + entryToUpdate + '"');
    console.log(currentDate);

    var myObj = {
    'websiteid': entryToUpdate,
    'status': responseCode,
    'responsetime': responseTime,
    'date': currentDate
    }

    collection.insert(myObj, function(){
        console.log('7. Success on Update');
    });
}

// Crawl all Function on request call
function crawlAll(req){
    var dbConnection = req.db;
    var collection = dbConnection.get('websitelist');

    collection.find({},{},function(e,docs){

        for (var key in docs) {
          var obj = docs[key];
          console.log(obj);
          website = obj.url;
          id = obj._id;

          getStatusCode(req,website,id);
      }
  });

}

module.exports = router;
