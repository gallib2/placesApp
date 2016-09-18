var express = require('express');
var router = express.Router();
var db = require('../database/db');
var userDB = require('../database/db').model('User');

var connectedUser = {};
var userNotfoundMsg = { msg: "" };
/* GET users listing. */
router.get('/', function(req, res, next) {

    connectedUser = req.session.user;
    res.render('RemoveUser', {user:connectedUser, userNotfoundMsg: userNotfoundMsg});

});

router.post('/', function(req, res, next) {
//remove user frop userDB:
    connectedUser = req.session.user;
    var userNameToRemove = req.body.userName;

    console.log(userNameToRemove +' removed');

    userDB.remove({ UserName: userNameToRemove }, function(err) {
        if (!err) {
            console.log('notification!');
            res.render('RemoveUser', {user:connectedUser, userNotfoundMsg: {msg:"Removed"}});
        }
        else {
            console.log('error!');
            res.render('RemoveUser', {user:connectedUser, userNotfoundMsg: {msg:"Not found in database"}});

        }
    });


});

module.exports = router;