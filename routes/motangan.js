var express = require('express');
var router = express.Router();

router.get('/:count', function (req, res, next) {
    var count = req.params.count
    console.log(count);
    require('../mongo/motangan').findQueryLimit({}, parseInt(count), function (result) {
        res.json(result);
    })
});
module.exports = router;
