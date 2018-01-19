var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var twilioSetup = require('./twilio-setup');

var toPhoneNumber = '+919602976558';
var fromPhoneNumber = '+16148080260';
var body = 'Testing Twilio';

app.get('/', function(req, res) {
   res.sendfile('index.html');
});


io.on('connection', function(socket) {
   console.log('A user connected');

   //twilioSetup.sendSms(toPhoneNumber,fromPhoneNumber,body);  

   socket.on('chat message', function(msg) {
    console.log(msg);

 });

   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
});


http.listen(3000, function() {
   console.log('listening on *:3000');
});