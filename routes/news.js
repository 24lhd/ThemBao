var express = require('express');
var listNews = require('../object/news');

var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.json(listNews);
});

module.exports = router;
