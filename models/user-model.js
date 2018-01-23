var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    _id:String,
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    phoneNumber:{
        type:Number,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,        
    },
    admin:{
        type:Boolean
    }

});

var userModel = mongoose.model('user',userSchema);

module.exports = userModel;