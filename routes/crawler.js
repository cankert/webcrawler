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

    function updateDbEntry(req,res){
        var db = req.db;
        var collection = db.get('websitelist');
        var entryToUpdate = req.query.id;
        collection.updateOne(
            {'_id' : entryToUpdate},
            {$set: {'status': response.statusCode, 'responsetime':response.elapsedTime}},
            function(err, result){
            res.send(
                (err === null) ? {msg: '' } : {msg: err }
            );
        });
    }


    getStatusCode();

    res.send();

});

//Update User Route
/*router.put('/updateuser/:id', function(req,res){
    var db = req.db;
    var collection = db.get('userlist');
    var userToUpdate = req.params.id;
    collection.updateOne({'_id' : userToUpdate},req.body, function(err, result){
        res.send(
            (err === null) ? {msg: '' } : {msg: err }
        );
    });
});
*/




module.exports = router;
