var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');

router.get('/scrape', function(req,res){
    console.log('Success');
    res.send(
        (err === null) ? {msg: '' } : {msg: err }
    );
});

module.exports = router;
