var express = require('express');
var mongoose = require('mongoose');
var userModel = require('../models/user-model');

var router = express.Router();

router.route('/')
.get((req,res,next)=>{

    var sampleUser = new userModel({
        _id:mongoose.Types.ObjectId(),
        firstName:'Chanpreet',
        lastName:'Chhabra',
        phoneNumber:'9602976558',
        password:'chanpreet',
        admin:true
    });
    
    sampleUser.save((err)=>{
        if(err)
            throw err;
    
        console.log('User created successfully');
        res.json({'success':true});
    });
});

module.exports = router;
