var Mongo = require('../config/MongoConnect');
module.exports = function (content, query,callback) {
    Mongo(function (db) {
        db.collection("Des").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result[0] == null) {
                db.collection("Des").insertOne(content, function (err, res) {
                    if (err) throw err;
                    callback();
                    db.close();
                });
            }
        })
    });
}