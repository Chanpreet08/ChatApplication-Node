var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');

router.use(morgan('dev'));
router.use(bodyParser.json());
router.route('/otp-verify')
.get((req,res,next)=>{
    res.json({'test':'initial test'});
})
.post((req,res,next)=>{
    
})

module.exports = router;

