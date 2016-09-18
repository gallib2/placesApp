var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../database/db');
var userdb = require('../database/db').model('User');

var userNotfoundMsg = { msg: "" };

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {userNotfoundMsg: ""});
});

router.post('/', function(req, res, next) {
  var userName = req.body.userName;
  var connectedUser = userdb.findOne({ UserName: userName }, function (err, match){
    if (err) {
      console.log(err);
    }
    else {
      if(match)
      {
        req.session.user = match;
        if(match.UserType === "AdminUser")        
        {
          res.redirect('adminDashboard');
        }
        else
        {
          res.redirect('dashboard');
        }                                       
      }
      else
      {
        userNotfoundMsg.msg = "User Not Found";
        res.render('index', {userNotfoundMsg: userNotfoundMsg});
      }
    }
  });
//TODO: changed - delete
  //res.render('index', { title: 'Express' });
});


router.post('/signup', function(req, res, next) {

  var userNameSingUp = req.body.userNameSingUp;
  var fullNameSingUp = req.body.fullNameSingUp;
  var encriptedPasswordSingUp = req.body.PasswordSingUp;

 userdb.find({UserName:userNameSingUp}, function(err, match){
   if(err)
   {
     console.log(err);
   }
   else if(match)
   {
     console.log(match);

     userNotfoundMsg.msg = "UserName exist";
     res.render('index', {userNotfoundMsg: userNotfoundMsg});
   }
   else {
     var newUser = new userdb({
       UserId: "",
       UserName: userNameSingUp,
       FullName: fullNameSingUp,
       EncriptedPassword: encriptedPasswordSingUp,
       UserType: "",
       Img :"d1.jpg" ,
       FavoritePlaces: [],
       friends: [],
       FriendRecommendations: []

     });

     console.log(newUser);

     newUser.save(function (err, newUser) {
       if (err) return console.error(err);
       var connectedUser = newUser;
       req.session.user = newUser;
       res.redirect('dashboard');
     });
   }
 });


  // TODO if the user is the same, or if the userName alredy taken

});

module.exports = router;
