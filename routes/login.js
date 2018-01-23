
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");
var bcrypt = require('bcrypt');
var config = require('../config');
var userModel = require('../models/user-model');

var app = express();
var router =express.Router();

var ExtractJwt = passportJWT.ExtractJwt;
var jwtStratergy = passportJWT.Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = config.secret;

var strategy = new jwtStratergy(jwtOptions,(jwt_payload,next)=>{
    console.log('payload received:'+jwt_payload);
    userModel.findOne({phoneNumber:jwt_payload.phoneNumber},(err,user)=>{
        if(err){
            res.json({sucess:false,'msg':'failed'});
        }
        else if(user){
            next(null,user);
        }
        else{
            next(null,false);
        }
    });
});

passport.use(strategy);
app.use(passport.initialize());

router.route('/request-token')
.get((req,res,next)=>{
    res.json({'test':'success'});
})
.post((req,res,next)=>{
    if(req.body.firstName && req.body.password &&req.body.lastName && req.body.phoneNumber){
        var phoneNumber = req.body.phoneNumber;
        var password = req.body.password;
        userModel.findOne({phoneNumber:phoneNumber},(err,user)=>{
            if(err){
                res.json({sucess:false,'msg':'err:failed'});
            }
            else if(!user){
                res.status(401).send({success:false,'msg':'no user found'});
            }
            else if(user.password == password){
                var payload = {id:user._id};
                console.log(payload);
                var token = jwt.sign(payload,jwtOptions.secretOrKey,{expiresIn:3600});
                userModel.findOneAndUpdate({_id:user._id},{token:token},(err,data)=>{
                    if(err) {
                        res.json({success:false,'msg':'failed'});
                        throw err;
                    }
                    res.json({sucess:true,'msg':'ok',token:token});
                });
                
            }
            else{
                res.status(401).send({sucess:false,'msg':'password did not match'});
            }
        });
    }
});

router.route('/login')
.post((req,res)=>{
    var phoneNumber = req.body.phoneNumber;
    var password = req.body.password;

    userModel.findOne({phoneNumber:phoneNumber},(err,user)=>{

        if(bcrypt.compareSync(password,user.password)){
            res.json({success:true,'msg':'successful login'});
        }else{
            res.json({success:false,'msg':'login failed'});
        }
        
    });
});

var test
router.route('/register')
.post((req,res)=>{
    var user = new userModel();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.phoneNumber = req.body.phoneNumber;
    user.admin = req.body.admin;

    var salt = bcrypt.genSaltSync(10);
    var pwdHash = bcrypt.hashSync(req.body.password,salt);

    user.password = pwdHash;
    user.token = "";
    user._id = mongoose.Types.ObjectId();
    user.save(user,(err,data)=>{
        if(err){
            res.json({success:false,'msg':'error in creating user'});
        }else{
            res.json({success:true,'msg':'user created'});
        }
    }); 

});

// router.route('/login')
// .post(passport.authenticate('jwt',{session:false}),(req,res,next)=>{
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
//     res.json({'msg':'Success! You cannot see this without a token'});
// });

function ensureAuth(req,res,next){
    var token;
    var header = req.headers["authorization"];
    if(header!==undefined){
        var bearer = header.split(" ");
        token = bearer[1];
        req.token = token;
        next();
    }else{
        res.status(403).send({success:false,'msg':'wrong header'});
    }
}

router.route("/loginDebug")
.get(function(req, res, next){
    console.log(req.get('Authorization'));
    next();
  }, function(req, res){
    res.json("debugging");
});
  

module.exports = router;