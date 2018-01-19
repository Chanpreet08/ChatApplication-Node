var twilio = require('twilio');

var accountSid = process.env.accountSid;
var accountAuth = process.env.accountAuth;

var methods = {};

methods.testfunction = function(){
    console.log('testing function');
}

methods.sendSms=function(toPhoneNumber,fromPhoneNumber,body){

    var client = new twilio(accountSid,accountAuth);
    
    client.messages.create({
      to: toPhoneNumber,
      from: fromPhoneNumber,
      body: body
    },function(err,msg){
        if(!err){
          console.log('success! The sid for the message is:'+msg.sid);
          console.log('Message sent on:'+msg.dateCreated);
        }
        else{
          console.log('Oops!! There was an error'); 
        }
    });
}

module.exports = methods;

