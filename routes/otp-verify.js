var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var rn = require('random-number');
var twilioSetup = require('../Twilio/twilio-setup');
var configVariables = require('../config');

var randomOptions = {
    min:1,
    max:1000000,
    integer:true
}
router.use(morgan('dev'));
router.use(bodyParser.json());
router.route('/otp-verify')
.get((req,res,next)=>{
    res.json({'test':'initial test'});
})
.post((req,res,next)=>{
    console.log(req.body);  
    if(req.body.file==='otp-verify'){
        var mobileNo = req.body.phoneNo;
        var otp = rn(randomOptions);
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
})

module.exports = router;

