var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://24duong:Haiduong24@ds161069.mlab.com:61069/bao";
// var url="mongodb://localhost:27017/news"
module.exports = function call(callbackMongo) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        callbackMongo(db);
    });
}