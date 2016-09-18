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
    res.render('AddPlace', {user:connectedUser, userNotfoundMsg: userNotfoundMsg});

});

router.post('/', function(req, res, next) {
//add user to userDB:
    console.log("addUser post");

    connectedUser = req.session.user;
    var BusinessId = req.body.BusinessId;
    var BusinessName = req.body.BusinessName;
    var City = req.body.City;
    var Address = req.body.Address;
    var OccupationWeekday = req.body.OccupationWeekday;
    var OccupationWeekend = req.body.OccupationWeekend;
    var Menu = req.body.Menu;
    var Kosher = req.body.Kosher;
    var BusinessHours = req.body.BusinessHours;

    var Type = req.body.Type;
    var FoodType = req.body.FoodType;
    var ChefName = req.body.ChefName;
    var Delivery = req.body.Delivery;

    console.log(BusinessId);
    console.log(BusinessName);
    console.log(City);
    console.log(Address);
    console.log(OccupationWeekday);
    console.log(OccupationWeekend);
    console.log(Menu);
    console.log(Kosher);
    console.log(BusinessHours);
    console.log(Type);
    console.log(FoodType);
    console.log(ChefName);
    console.log(Delivery);

    placedb.findOne({ BusinessId: BusinessId }, function (err, match){
        if (err) {
            console.log(err);
        }
        else {
            if(match)
            {
                res.render('AddPlace', {user:connectedUser, userNotfoundMsg: {msg:"Business Id exist in DataBase"}});
            }
            else
            {
                //create Place from form
                var placeToAdd = new placedb({
                    //_id:"",
                    BusinessId: BusinessId,
                    BusinessName: BusinessName,
                    City: City,
                    Img: "logo.png",
                    Address:Address,
                    Occupation: {Weekday:OccupationWeekday,Weekend:OccupationWeekend},
                    Menu: Menu,
                    Kosher: false,
                    BusinessHours: BusinessHours,
                    Sales: [],
                    BusinessType: Type,
                    FoodType: FoodType,
                    ChefName: ChefName,
                    Delivery: Delivery

                });
                if(Delivery==="true")
                {
                    placeToAdd.BusinessType.Delivery = true;
                }
                if(Kosher==="true")
                {
                    placeToAdd.Kosher = true;
                }
                //add to db
                placeToAdd.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.render('AddPlace', {user:connectedUser, userNotfoundMsg: {msg:"Error"}});
                    }
                    else {
                        console.log("User saved");
                        res.render('AddPlace', {user:connectedUser, userNotfoundMsg: {msg:"Place Saved"}});
                    }
                });
            }
        }
    });
});
module.exports = router;