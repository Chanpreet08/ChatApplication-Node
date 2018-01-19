var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    _id:String,
    firstName:String,
    lastName:String,
    phoneNumber:Number,
    otp:Number
});

var userModel = mongoose.model('user',userSchema);

module.exports = userModel;