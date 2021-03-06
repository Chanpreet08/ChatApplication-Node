var app = require('express')();
var rn = require('random-number');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var auth = require('./routes/auth');
var login = require('./routes/login');
var setup = require('./routes/setup');
var mongodbUrl = process.env.mongoUrl;

mongoose.connect(mongodbUrl);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error',console.error.bind(console,"MongoDB connection error:"));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/authenticate',auth);
app.use('/api',login);
app.use('/setup',setup);

app.get('/', function(req, res) {
   res.sendfile('./public/login.html');
});


io.on('connection', function(socket) {
   console.log('A user connected'); 
   socket.on('chat message', function(msg) {
    console.log(msg);

 });

   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });
});


http.listen(process.env.PORT||3000, function() {
   console.log('listening on http://localhost:3000');
});