var express = require('express');
var categorys = require('../object/categorys');

var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.json(categorys);
});

module.exports = router;