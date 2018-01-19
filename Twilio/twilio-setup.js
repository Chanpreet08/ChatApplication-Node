var twilio = require('twilio');

var accountSid = process.env.accountSid;
var accountAuth = process.env.accountAuth;

var methods = {};


methods.sendSms = function(toPhoneNumber,fromPhoneNumber,body){

    var client = new twilio(accountSid,accountAuth);
    
    client.messages.create({
      to: toPhoneNumber,
      from: fromPhoneNumber,
      body: body
    },function(err,msg){
        if(!err){ 
          console.log('success! The sid for the message is:'+msg.sid);
          console.log('Message sent on:'+msg.dateCreated);
          return true;
        }
        else{
          console.log('Oops!! There was an error'); 
          return false;
        }
    });
}

module.exports = methods;

