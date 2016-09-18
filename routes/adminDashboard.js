var express = require('express');
var router = express.Router();
var db = require('../database/db');
var userSchema = require('../database/db').model('User');

var connectedUser = {};

/* GET users listing. */
router.get('/', function(req, res, next) {

    connectedUser = req.session.user;
    res.render('adminDashboard', {user:connectedUser});

});

module.exports = router;