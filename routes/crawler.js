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

function getStatusCode(req,website,id){
    request.get({
        url: website,
        time: true
    },function(err,response){
        var responseCode = response.statusCode;
        var responseTime = response.elapsedTime;

        updateDbEntry(req,responseCode,responseTime, id);
    });
}

function updateDbEntry(req,responseCode,responseTime, id){
    var db = req.db;
    var collection = db.get('crawl');
    var currentDate = new Date ();

    console.log('## Inserting new Status entry for ' + id + 'on ' + currentDate );

    var myObj = {
    'websiteid': id,
    'status': responseCode,
    'responsetime': responseTime,
    'date': currentDate
    }

    collection.insert(myObj, function(){
        console.log('## Success on Update');
    });
}

// Crawl all Function on request call
function crawlAll(req){
    var dbConnection = req.db;
    var collection = dbConnection.get('websitelist');

    collection.find({},{},function(e,docs){

        for (var key in docs) {
          var obj = docs[key];
          website = obj.url;
          id = obj._id;

          getStatusCode(req,website,id);
      }
  });

}

module.exports = router;
