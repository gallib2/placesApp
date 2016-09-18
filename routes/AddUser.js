var express = require('express');
var router = express.Router();
var db = require('../database/db');
var mongoose = require('mongoose');
var userDB = require('../database/db').model('User');
var placedb = require('../database/db').model('Place');

var connectedUser = {};
var userNotfoundMsg = { msg: "" };

/* GET users listing. */
router.get('/', function(req, res, next) {

    connectedUser = req.session.user;
    res.render('AddUser', {user:connectedUser, userNotfoundMsg: userNotfoundMsg});

});

router.post('/', function(req, res, next) {
//add user to userDB:
    console.log("addUser post");

    connectedUser = req.session.user;
    var UserId = req.body.UserId;
    var UserName = req.body.UserName;
    var FullName = req.body.FullName;
    var Password = req.body.Password;
    var UserType = req.body.UserType;
    console.log(UserId);
    console.log(UserName);
    console.log(FullName);
    console.log(Password);
    console.log(UserType);

    userDB.findOne({ UserName: UserName }, function (err, match){
        if (err) {
            console.log(err);
        }
        else {
            if(match)
            {
                res.render('AddUser', {user:connectedUser, userNotfoundMsg: {msg:UserName+" is Taken, choose another User name"}});

            }
            else
            {
                //create user from form
                var userToAdd = new userDB({
                    UserId: UserId,
                    UserName: UserName,
                    FullName: FullName,
                    EncriptedPassword: Password,
                    UserType: UserType,
                    Img :"d1.jpg" ,
                    FavoritePlaces: [],
                    friends: [],
                    FriendRecommendations: []

                });
                //add to db
                userToAdd.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.render('AddUser', {user:connectedUser, userNotfoundMsg: {msg:"error"}});
                    }
                    else {
                        console.log("User saved");
                        res.render('AddUser', {user:connectedUser, userNotfoundMsg: {msg:"User saved"}});
                    }
                });
            }
        }
    });
});
module.exports = router;