var express = require('express');
var router = express.Router();
const monk = require('monk')


/* GET home page. */
router.get('/', function(req, res, next) {
    var db = req.db;
    var collection = db.get('websitelist');
    collection.find({},{},function(e,docs){
        res.render('index', {title: 'Test' , websitedata: docs });
    });
});

router.get('/website/:id/:name?', function(req, res, next) {
    var db = req.db;
    var collection = db.get('crawl');
    var documentId = req.params.id;
    var name = req.params.name;
    //var ObjectId = ObjectId(documentId);
    //var query = {'websiteid': documentId};
    //console.log(query);

    collection.find({'websiteid': monk.id(documentId)}, {sort: {date:-1}}).then((website) => {
        //console.log(website);
        res.render('website', { title: name , statusdata: website});
    });
});

module.exports = router;
