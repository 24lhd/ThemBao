/**
 * Created by D on 7/19/2017.
 */
var express = require('express');
var VnExpree=require('../news/VnExpress')
var router = express.Router();

router.get('/', function (req, res, next) {

    res.send(JSON.stringify(VnExpree));
});

module.exports = router;
