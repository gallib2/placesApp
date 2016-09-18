var express = require('express');
var router = express.Router();
var db = require('../database/db');
var userDB = require('../database/db').model('User');
var placedb = require('../database/db').model('Place');

/* GET users listing. */

router.get('/', function(req, res, next) {
    var connectedUser = req.session.user;
    console.log('connected:' + connectedUser.UserName);

    placedb.find({
        'BusinessId': { $in: connectedUser.FavoritePlaces}
    }, function(err, places){
        console.log(places.length);
            res.render('userPlaces', {user: connectedUser, places : places});
        console.log(places);

    });

});




router.get('/moreInfo/:BusinessId', function(req, res, next) {
    var businessId = req.params.BusinessId;
    var connectedUser = req.session.user;
    placedb.findOne({BusinessId : businessId}, function(err, place){
        if(place)
        {
            res.render('moreInfo', {user: connectedUser, place:place});
        }
    });
});

router.post('/', function(req, res, next) {

    console.log(req.body.placeId);

    var connectedUser = req.session.user;
    var businessId = req.body.placeId;

    var placesArr = connectedUser.FavoritePlaces;

    for(i=placesArr.length - 1 ; i >= 0 ; i--)
    {
        if(placesArr[i] === businessId )
        {
            placesArr.splice(i, 1);
        }
    }

    userDB.update( {UserName: connectedUser.UserName }, { FavoritePlaces: placesArr  }, { multi: true } ,function (err, numEffected) {
            if(err) {
                console.log("error");
            }
            else{
                res.redirect('./userPlaces');
            }
    });

});


module.exports = router;
