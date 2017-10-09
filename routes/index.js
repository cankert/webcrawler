var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/website/:id', function(req, res, next) {
    var id = req.params.id;
    res.render('website', { title: id });
});

module.exports = router;
