var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cron = require('node-cron');
var restler = require('restler');
//Database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/webcrawler');
var index = require('./routes/index');
var websites = require('./routes/websites');
var crawler = require('./routes/crawler');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Make db accessible to every request
app.use(function(req,res,next){
    req.db = db;
    next();
});
//normal Routes
app.use('/', index);
app.use('/websites', websites);
app.use('/crawler', crawler);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var task = cron.schedule('*/5 * * * *', function(){
    console.log('running a task every 5 minutes');
    var getResp = function(url){
        restler.get(url).on('complete', function(response){
            console.log('Called API');
        });
    };
    getResp('http://localhost:3000/crawler/crawl');
}, true);

//task.start();


module.exports = app;
