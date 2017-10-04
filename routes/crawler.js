var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

router.get('/scrape/', function(req,res){
    //var pageToVisit = req.data;

    console.log('1. /scrape got called, starting Crawl');
    var websiteToCrawl = req.query.website;
    console.log('2. Starting Crawl for this Website: ' + websiteToCrawl);

    function getStatusCode(){
        request.get({
            url: websiteToCrawl,
            time: true
        },function(err,response){
            console.log('3. Visiting Website ' + websiteToCrawl);
            console.log('4. Status code of Website: ' + response.statusCode);
            console.log('5. Response Time: ' + response.elapsedTime + 'ms');
        });
    }

    getStatusCode();

    res.send();

});

module.exports = router;
