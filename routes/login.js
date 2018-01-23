var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var config = require('../config');
var userModel = require('../models/user-model');

var app = express();
var router =express.Router();

app.set('superSecret',config.secret);

router.get('/',(req,res,next)=>{
    res.json({'test':'success'});
});

module.exports = router;