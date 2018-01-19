var app = require('express')();
var rn = require('random-number');
var logger = require('morgan');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var otpVerify = require('./routes/otp-verify');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/authenticate',otpVerify);

app.get('/', function(req, res) {
   res.sendfile('./public/login.html');
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
   console.log('listening on http://localhost:3000');
});