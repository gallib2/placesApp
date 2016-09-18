var express = require('express');
var router = express.Router();
var db = require('../database/db');
var userDB = require('../database/db').model('User');
var placedb = require('../database/db').model('Place');

router.get('/', function(req, res, next) {
    var connectedUser = req.session.user;
    userDB.find({
        'UserName': { $in: connectedUser.friends}
    }, function(err, friends){
        console.log("num of friends: " + friends.length)
        res.render('userFriends', {user: connectedUser, friends : friends});
    });
});

router.get('/Details/:friendsUserName', function(req, res, next) {
    var friendsUserName = req.params.friendsUserName;
    var connectedUser = req.session.user;
    userDB.findOne({"UserName": friendsUserName}, function(err, friend){
        placedb.find({
            'BusinessId': { $in: friend.FavoritePlaces}
        }, function(err, places){
            console.log(places);
            res.render('friendsDetails', {user:connectedUser, friend:friend, places:places});

        });
    });

});

router.post('/:friendsUserName', function(req, res, next) {
    //remove friend from my friends list - update userDB:
    var connectedUser = req.session.user;
    var friendsUserName = req.params.friendsUserName;

    console.log("connected user:" + connectedUser.UserName);
    console.log("user to remove:" + friendsUserName);

          //create friends list to return:
            var updatedFriends = connectedUser.friends;
        console.log("friends list:" + updatedFriends);

        //find and remove friend's userName from my friends list:
        for (var i=updatedFriends.length-1; i>=0; i--) {
            if (updatedFriends[i] === friendsUserName) {
                console.log("friend found - " + updatedFriends[i]);

                updatedFriends.splice(i, 1);
                // break;       //<-- Uncomment  if only the first term has to be removed
            }
        }
        console.log("updated list: " + updatedFriends);

        //update userDB:
        var query = { UserName: connectedUser.UserName };
        userDB.update(query, { friends: updatedFriends }, { multi: true }, function (err, numAffected) {
            if (err)
            {return handleError(err);}
            res.redirect("/userFriends");
            console.log("db: " + connectedUser.friends);

        });
});

module.exports = router;
