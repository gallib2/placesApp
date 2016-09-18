var express = require('express');
var router = express.Router();
var db = require('../database/db');
var userDB = require('../database/db').model('User');
var placedb = require('../database/db').model('Place');

var connectedUser = {};
var userNotfoundMsg = { msg: "" };
/* GET users listing. */
router.get('/', function(req, res, next) {

    connectedUser = req.session.user;
    res.render('RemovePlace', {user:connectedUser, userNotfoundMsg: userNotfoundMsg});

});

router.post('/', function(req, res, next) {
//remove user frop userDB:

    connectedUser = req.session.user;
    var BusinessIdToRemove = req.body.BusinessId;

    console.log(BusinessIdToRemove +' removed');

    placedb.remove({ BusinessId: BusinessIdToRemove }, function(err) {
        if (!err) {
            console.log('notification!');
            res.render('RemovePlace', {user:connectedUser, userNotfoundMsg: {msg:"Removed"}});
        }
        else {
            console.log('error!');
            res.render('RemovePlace', {user:connectedUser, userNotfoundMsg: {msg:"Not found"}});

        }
    });


});

module.exports = router;