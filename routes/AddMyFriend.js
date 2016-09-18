var express = require('express');
var router = express.Router();
var db = require('../database/db');
var userDB = require('../database/db').model('User');

var connectedUser = {};
var userNotfoundMsg = { msg: "" };
/* GET users listing. */
router.get('/', function(req, res, next) {

    connectedUser = req.session.user;
    res.render('AddMyFriend', {user:connectedUser, userNotfoundMsg: userNotfoundMsg});

});

router.post('/', function(req, res, next) {
//remove user frop userDB:
    connectedUser = req.session.user;
    var userNameToAdd = req.body.userName;
if(userNameToAdd===connectedUser.UserName)
{
    res.render('AddMyFriend', {user:connectedUser, userNotfoundMsg: {msg: "Can not add yourself"}});

}
else {
    userDB.findOne({UserName: userNameToAdd}, function (err, match) {
        if (err) {
            console.log(err);
        }
        else {
            if (match) {
                //check if username is already in friends array
                connectedUser.friends.forEach(function (friend, index, arr) {
                    if (friend === userNameToAdd) {
                        res.render('AddMyFriend', {
                            user: connectedUser,
                            userNotfoundMsg: {msg: userNameToAdd + " Is already your friend"}
                        });
                        return;
                    }
                });
                //add userName to friends array
                var newFriendsList = connectedUser.friends;
                newFriendsList.push(userNameToAdd);

                //update userDB:
                var query = {UserName: connectedUser.UserName};
                userDB.update(query, {friends: newFriendsList}, {multi: true}, function (err, numAffected) {
                    if (err) {
                        return handleError(err);
                    }
                    res.render('AddMyFriend', {
                        user: connectedUser,
                        userNotfoundMsg: {msg: userNameToAdd + " Added successfully"}
                    });

                });
            }
            else {

                res.render('AddMyFriend', {user: connectedUser, userNotfoundMsg: {msg: userNameToAdd + " Not Found"}});
            }
        }
    });
}
});

module.exports = router;