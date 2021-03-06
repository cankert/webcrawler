var express = require('express');
var router = express.Router();
const monk = require('monk')

//Get websiteList

router.get('/websitelist', function (req,res){
    var db = req.db;
    var collection = db.get('websitelist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });



});

//Get status

router.get('/getstatus/:id', function (req,res){
    var db = req.db;
    var collection = db.get('crawl');
    var documentId = req.params.id;
    //var ObjectId = ObjectId(documentId);
    var query = {'websiteid': documentId};
    //console.log(query);

    collection.find({'websiteid': monk.id(documentId)}, {sort: {responsetime:1}}).then((website) => {
        //console.log(website);
        res.json(website);
    })

});

//Add User Route
router.post('/addwebsite', function(req,res){
    var db = req.db;
    var collection = db.get('websitelist');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? {msg: '' } : {msg: err }
        );
    });
});

// Delete User
router.delete('/deleteWebsite/:id', function(req,res){
    var db = req.db;
    var collection = db.get('websitelist');
    var websiteToDelete = req.params.id;
    collection.remove({'_id' : websiteToDelete}, function(err){
        res.send((err === null) ? {msg: '' } : {msg: '' } );
    });

});
/*
//Update User Route
router.put('/updateuser/:id', function(req,res){
    //console.log('trying to update');
    var db = req.db;
    var collection = db.get('websiteList');
    var userToUpdate = req.params.id;
    collection.update({'_id' : userToUpdate},req.body, function(err, result){
        res.send(
            (err === null) ? {msg: '' } : {msg: err }
        );
    });
});

/*router.put('/updateuser/:id', function (req, res) {
  res.send('Got a PUT request at /user');
});
*/
module.exports = router;
