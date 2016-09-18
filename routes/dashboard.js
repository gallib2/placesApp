var express = require('express');
var router = express.Router();
var db = require('../database/db');
var userSchema = require('../database/db').model('User');
var placedb = require('../database/db').model('Place');

// TODO: changed - delete

//var businessSchema = require('../database/db').model('Business');
var connectedUser = {};

/* GET users listing. */
router.get('/', function(req, res, next) {

    connectedUser = req.session.user;
	placedb.find({
        'BusinessId': { $in: connectedUser.FavoritePlaces}
    }, function(err, places){
            res.render('dashboard', {user: connectedUser, places : places});
    });

});
//TODO: changed - delete
/*
function onShowPlacesClicked()
{

}
*/
module.exports = router;
