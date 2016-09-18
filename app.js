var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');

var routes = require('./routes/index');
var users = require('./routes/users');
var dashboard = require('./routes/dashboard');
var userPlaces = require('./routes/userPlaces');
var userFriends = require('./routes/userFriends');
var adminDashboard = require('./routes/adminDashboard');
var RemoveUser = require('./routes/RemoveUser');
var AddUser = require('./routes/AddUser');
var AddPlace = require('./routes/AddPlace');
var RemovePlace = require('./routes/RemovePlace');
var AddMyFriend = require('./routes/AddMyFriend');
var AddMyPlace = require('./routes/AddMyPlace');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));


app.use('/', routes);
app.use('/users', users);
app.use('/dashboard', dashboard);
app.use('/userPlaces', userPlaces);
app.use('/userFriends', userFriends);
app.use('/adminDashboard', adminDashboard);
app.use('/RemoveUser', RemoveUser);
app.use('/AddUser', AddUser);
app.use('/AddPlace', AddPlace);
app.use('/RemovePlace', RemovePlace);
app.use('/AddMyFriend', AddMyFriend);
app.use('/AddMyPlace', AddMyPlace);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
