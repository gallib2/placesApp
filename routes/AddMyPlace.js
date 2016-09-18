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
    res.render('AddMyPlace', {user:connectedUser, userNotfoundMsg: userNotfoundMsg});

});


router.post('/', function(req, res, next) {
//Add place to placeDB:
    connectedUser = req.session.user;
    var PlaceNameToAdd = req.body.placeName;

    placedb.findOne({ BusinessName: PlaceNameToAdd }, function (err, match){
        if (err) {
            console.log(err);
        }
        else {
            if(match)
            {
                var placeIDToAdd = match.BusinessId;
                //check if Placename is already in FavoritePlaces array
                connectedUser.FavoritePlaces.forEach(function(placeId, index, arr){
                    if(placeId===placeIDToAdd)
                    {
                        res.render('AddMyPlace', {user:connectedUser, userNotfoundMsg: {msg: PlaceNameToAdd+" Is already in your places"}});
                    }
                });
                //add userName to friends array
                var newPlacesList = connectedUser.FavoritePlaces;
                newPlacesList.push(placeIDToAdd);

                //update userDB:
                var query = { UserName: connectedUser.UserName };
                userDB.update(query, { FavoritePlaces: newPlacesList }, { multi: true }, function (err, numAffected) {
                    if (err)
                    {return handleError(err);}
                    res.render('AddMyPlace', {user:connectedUser, userNotfoundMsg: {msg: PlaceNameToAdd+" Added successfully"}});

                });
            }
            else
            {

                res.render('AddMyPlace', {user:connectedUser, userNotfoundMsg: {msg: PlaceNameToAdd+" Not Found"}});
            }
        }
    });
});

router.get('/filterPlaces', function(req, res, next) {

    var connectedUser = req.session.user;

    var Type = req.query.checkboxType;
    var City = req.query.checkboxCity;
    var Kosher = req.query.checkboxKosher;
    var FoodType = req.query.checkboxFood;
    var Delivery = req.query.checkboxDelivery;
    var checkboxSales = req.query.checkboxSales;

    //var arr = [];
    // arr.push({'placeType':placeType} , {'City':City} , {'Kosher': Kosher}); //, {'Type' : }, {checkboxDelivery}, {checkboxSales});

    var query = {};

    if(Type == 'on'){
        query.BusinessType = req.query.businessType;
    }
    if(City == 'on'){
        query.City = req.query.city;
    }
    if(Kosher == 'on'){
        query.Kosher = true;
    }
    if(FoodType == 'on'){
        query.FoodType = req.query.foodType;
    }
    if(Delivery == 'on'){
        query.Delivery = true;
    }

    placedb.find(query, function(err,places){
        if(err){console.log(err);
            return;}
        res.render('filterPlaces', {user: connectedUser, places : places, userNotfoundMsg: {msg: ""}});

    });





});

router.post('/Add', function(req, res, next) {

    var connectedUser = req.session.user;
    var placeId = req.body.placeId;
    var newFavoritePlaces = connectedUser.FavoritePlaces;


  //  newFavoritePlaces.push(placeId);

    ///////////////////////////////

    console.log("newFavoritePlaces" + newFavoritePlaces.length);
    console.log( "newFavoritePlaces " + newFavoritePlaces.hasOwnProperty(newFavoritePlaces));

    /*    if(newFavoritePlaces.length > 0 && newFavoritePlaces.BusinessId.hasOwnProperty(placeId) == false)
        {
            //userNotfoundMsg.msg = " Added successfully"
            //res.redirect('./');
            //res.redirect('userPlaces');
            //res.render('AddMyPlace', {user:connectedUser, userNotfoundMsg: {msg: "already exist"}});
            //userNotfoundMsg.msg = "already exist";
            console.log("In the ifffff");

            res.redirect('../userPlaces');
        }
        else {*/
            newFavoritePlaces.push(placeId);
            var query = {UserName: connectedUser.UserName};
            userDB.update(query, {FavoritePlaces: newFavoritePlaces}, {multi: true}, function (err, numAffected) {
                if (err) {
                    console.log(" error from /add :"  + err)
                }

                else {

                    //userNotfoundMsg.msg = " Added successfully"
                   // res.redirect('./');
                   // res.redirect('userPlaces');
                    //res.render('AddMyPlace', {user: connectedUser, userNotfoundMsg: {msg: " Added successfully"}});

                   // userNotfoundMsg.msg = "Added successfully";
                    console.log("num effected:" + numAffected);
                    res.redirect('../userPlaces');
                }
            });
      //  }


    ////////////////////////////////
/*
    var query = { UserName: connectedUser.UserName };
    userDB.update(query, { FavoritePlaces: newFavoritePlaces }, { multi: true }, function (err, numAffected) {
        if (err)
        {console.log(err)}

        else {

            console.log(numAffected);
            res.render('AddMyPlace', {user:connectedUser, userNotfoundMsg: {msg: " Added successfully"}});
        }


    });
 */

});


/*function getAllBusinessTypes() {
    var bussTypes = [];

    Place.find({}, 'BusinessType').distinct('BusinessType', function (err, businessTypes) {
        if(err) {
            console.log(err);
        }
        else {
            bussTypes = businessTypes;
            console.log(bussTypes);
        }
    });

    // var anotherResult = Place.find({}, 'BusinessType').distinct('BusinessType');

    //return bussTypes;
}*/



module.exports = router;