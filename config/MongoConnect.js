var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://24duong:Haiduong24@ds155087.mlab.com:55087/baooff";
// var url="mongodb://localhost:27017/news"
module.exports = function call(callbackMongo) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        callbackMongo(db);
    });
}