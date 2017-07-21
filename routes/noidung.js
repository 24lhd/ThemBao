var express = require('express');
var router = express.Router();

router.get('/:count', function (req, res, next) {
    var count = req.params.count
    console.log(count);
    require('../mongo/noidung').findQueryLimit({}, parseInt(count), function (result) {

        result.contentHTML= new String( result.contentHTML).replace("\n","").replace("\t","").replace("\\","").replace("  "," ")
        res.json(result );
    })
});
module.exports = router;
