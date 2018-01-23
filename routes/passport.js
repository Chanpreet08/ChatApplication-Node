var passport = require("passport");
var passportJWT = require("passport-jwt");
var config = require('../config');
var userModel = require('../models/user-model');

var extractJwt = passportJWT.ExtractJwt;
var jwtStrategy = passportJWT.Strategy;
var params = {
    jwtFromRequest :extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : config.secret
};

module.exports = function(){
    var strategy = new jwtStrategy(params,(payload,done)=>{
        console.log('payload received:'+jwt_payload);
        userModel.findOne({phoneNumber:jwt_payload.phoneNumber},(err,user)=>{
            if(err){
                res.json({sucess:false,'msg':'failed'});
            }
            else if(user){
                return done(null,{id:user._id});
            }
            else{
                return done(new Error("User not found"), null);
            }
        });
    });

    passport.use(strategy);

    return{
        initialize:function(){
            return passport.initialize();
        },
        authenticate:function(){
            return passport.authenticate("jwt",{
                session: false
            });
        }
    };
}
