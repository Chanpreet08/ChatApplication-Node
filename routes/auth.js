var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var rn = require('random-number');
var twilio = require('twilio');
var mongoose = require('mongoose');
var userModel = require('../models/user-model');

var accountSid = process.env.accountSid;
var accountAuth = process.env.accountAuth;
var fromPhoneNumber = process.env.fromPhoneNumber;

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
        var body = "One time password is:"+otp;
        var fromPhoneNumber = fromPhoneNumber;
        var user = new userModel();

        userModel.findOne({phoneNumber:phoneNumber}).exec((err,data)=>{
            if(err){
                res.json({'success':false,'msg':'error in searching'});
            }
            else if(data.length==0){
                user._id =  mongoose.Types.ObjectId();
                user.firstName = firstName;
                user.lastName = lastName;
                user.phoneNumber = phoneNumber;
                user.otp = otp;
                user.authenticated = false;
                user.save((err)=>{
                    if(err){
                        console.log('error in creating user');
                        res.json({'success':false,'msg':'error in creating user'});
                    }
                });
            }else{
                user._id = data._id;
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.phoneNumber = data.phoneNumber;
                user.otp =otp;
                user.authenticated = data.authenticated;
                userModel.findOneAndUpdate({'_id':user._id},{'otp':otp},(err,dt)=>{if(err)throw err;});
            }
            var client = new twilio(accountSid,accountAuth);   
            client.messages.create({
            to: '+91'+phoneNumber,
            from: fromPhoneNumber,
            body: body
            },function(err,msg){
                if(!err){ 
                console.log('success! The sid for the message is:'+msg.sid);
                console.log('Message sent on:'+msg.dateCreated);
                res.json({'success':true,'msg':'successfully verified','id':data._id});
                }
                else{
                console.log('Oops!! There was an error'); 
                res.json({'success':false,'msg':'otp-verification failed'});
                }
            });
        });      
    }
    else{
        res.json({'success':false,'msg':'Invalid Path'});
    }
});

router.route('/otp-verify')
.post((req,res,next)=>{
    var id = req.body.id;
    var otp = req.body.otp;

    userModel.findOne({'_id':id}).exec((err,data)=>{

        if(err){
            res.json({'success':false,'msg':'error'});
        }
        if(otp == data.otp){
            userModel.findOneAndUpdate({'_id':id},{'authenticated':true},(err)=>{if(err)console.log(err)});
            res.json({'success':true,'msg':'success'});
        }
        else{
            res.json({'success':true,'msg':'failed'});
        }
    });
});

module.exports = router;

