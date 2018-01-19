var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var rn = require('random-number');
var twilioSetup = require('../Twilio/twilio-setup');
var configVariables = require('../config');
var userModel = require('../models/user-model');

var randomOptions = {
    min:1,
    max:1000000,
    integer:true
}
router.use(morgan('dev'));
router.use(bodyParser.json());

router.route('/otp-request')
.get((req,res,next)=>{
    res.json({'test':'initial test'});
})
.post((req,res,next)=>{ 
    if(req.body.file==='otp-verify'){
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var phoneNumber = req.body.phoneNumber;
        var otp = rn(randomOptions);
        var user = new userModel();
        user.firstName = firstName;
        user.lastName = lastName;
        user.phoneNumber = phoneNumber;
        user.otp = otp;
        user.save((err,data)=>{
            if(err){
                console.log('error in creating user');
            }
            else{
                console.log('user created');
                console.log(data)
            }
        })
        var body = "One time password is:"+otp;
        var fromPhoneNumber = configVariables.fromPhoneNumber;
        if(twilioSetup.sendSms(mobileNo,fromPhoneNumber,body)===true){
            res.json({'success':true,'msg':'successfully verified'});
        }else{
             res.json({'success':false,'msg':'otp-verification failed'});
        }
    }
    else{
        res.json({'success':false,'msg':'Invalid Path'});
    }
});

router.route('/otp-verify')
.post((req,res,next)=>{
    
});

module.exports = router;

