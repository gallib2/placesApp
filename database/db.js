var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/placesApp');


var db = mongoose.connection;

var userSchema = new Schema({
    UserId: Number,
    UserName: String,
    FullName: String,
    EncriptedPassword: mongoose.Schema.Types.Mixed,
    UserType: String,
    Img : String,
    FavoritePlaces: [
        mongoose.Schema.Types.Mixed
    ],
    friends: [String],                                  //userNames
    FriendRecommendations: [{
        BusinessId: mongoose.Schema.Types.ObjectId,
        FriendsName: String,
        Text: String
    }]
});

//userSchema.index({UserName :1});

var placeSchema = new Schema({
    BusinessId: Number,
    BusinessName: String,
    City: String,
   // img: { data: Buffer, contentType: String },
    Img: String,
    Address: String,
    Occupation: [{weekday:String, Weekend:String}],
    Menu: String,
    Kosher: Boolean,
    BusinessHours: String,
    Sales: [String],
    BusinessType: String,
    FoodType: String,
    ChefName: String,
    Delivery: Boolean
});

var User = mongoose.model('User', userSchema);
var Place = mongoose.model('Place', placeSchema);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log("mongoose connected");
});





module.exports = db;
module.exports = Place;
module.exports = User;

