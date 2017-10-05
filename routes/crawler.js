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
    var collection = db.get('websitelist');

    console.log('6. Starting db update for "' + entryToUpdate + '"');

    collection.update(
        { "_id" : entryToUpdate },
        { "$set" : { 'status' : responseCode, 'responsetime' : responseTime } },
        { "upsert" : true }
    );
    console.log('7. Success on Update');
}

// Crawl all Function
function crawlAll(req){
    var dbConnection = req.db;
    var collection = dbConnection.get('websitelist');
    var websiteListData = "";
    collection.find({},{},function(e,docs){
        websiteListData = docs;
        console.log('Data received');
        console.log(websiteListData);
        //console.log(websiteListData);
    });

    _.forEach([websiteListData,2], function(value) {
        console.log('value');
    });

    var arr = Object.values(websiteListData);
    console.info(arr);

    arr.forEach(function(current_value) {
            //console.log(current_value);
            console.log('TEST');
        });

    _.forEach([1,2,3], function(value) {
        console.log(value);
    });




    //websiteListData.forEach( function( item ) {
    //    console.log( item );
    //});
}

            /*websiteListData.forEach(function(website, index){
            var websiteToCrawl = this.url;
            var entryToUpdate = this._id;

            getStatusCode(req,websiteToCrawl, entryToUpdate);
        });*/


            /*$.ajax({
                type: 'GET',
                url: ('/crawler/scrape/'),
                data: {website: websiteToCrawl, id: entryId},
                }).done(function(response){
                    // Function when done
            });*/



module.exports = router;
