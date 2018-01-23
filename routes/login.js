
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var userModel = require('../models/user-model');

var app = express();
var router =express.Router();

router.route('/login')
.post((req,res)=>{
    var token = req.body.token;
    if(token){
        var phoneNumber = req.body.phoneNumber;
        var password = req.body.password;
        var secretKey = process.env.secretKey;
        userModel.findOne({phoneNumber:phoneNumber},(err,user)=>{

            if(bcrypt.compareSync(password,user.password)){
                jwt.verify(token,secretKey,(err,decoded)=>{
                    if(err){
                        res.json({success:false,'msg':'error in validating token'});
                    }else{
                        if(decoded.phoneNumber == user.phoneNumber){
                            res.json({success:true,'msg':'successful login'});
                        }else{
                            res.status(401).send({success:false,'msg':'UnAuthorized login'});
                        }
                    }
                });
                //res.json({success:true,'msg':'successful login'});
            }else{
                res.json({success:false,'msg':'login failed'});
            }
            
        });
    }else{
        res.status(401).send({success:false,'msg':'unauthorized'});
    }
    
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
    const payload = {
        phoneNumber:user.phoneNumber
    };
    var token = jwt.sign(payload,config.secret,{expiresIn:'1440m'});
    user.token = token;
    user._id = mongoose.Types.ObjectId();
    user.save(user,(err,data)=>{
        if(err){
            res.json({success:false,'msg':'error in creating user'});
        }else{
            res.json({success:true,'msg':'user created',token:token});
        }
    }); 

});
  

module.exports = router;