var Mongo = require('../config/MongoConnect');
var CollName = 'NoiDung'
module.exports = {
    insertOne: function (content, query, callback) {
        Mongo(function (db) {
            db.collection(CollName).deleteMany(query,function (err, result) {
                if (err) throw err;
                db.collection(CollName).insertOne(content, function (err, res) {
                    if (err) throw err;
                    // console.log("Query chèn Nội dung "+JSON.stringify(query))
                    callback();
                    db.close();
                });
            })
        })
    },
    findAll: function (callback) {
        Mongo(function (db) {
            db.collection(CollName).find({}).toArray(function (err, result) {
                if (err) throw err;
                callback(result);
                db.close();
            })
        })
    },
    findQuery: function (query, callback) {
        Mongo(function (db) {
            db.collection(CollName).find(query).toArray(function (err, result) {
                if (err) throw err;
                callback(result);
                db.close();
            })
        })
    },
    findQueryLimit: function (query, limit, callback) {
        Mongo(function (db) {
            db.collection(CollName).find(query).limit(limit).sort({__id: -1}).toArray(function (err, result) {
                if (err) throw err;
                callback(result);
                db.close();
            })
        })
    },
    deleteOne: function (query, callback) {
        Mongo(function (db) {
            db.collection(CollName).deleteOne(query).toArray(function (err, result) {
                if (err) throw err;
                callback(result);
                db.close();
            })
        })
    },
    countQuery: function (query, callback) {
        Mongo(function (db) {
            db.collection(CollName).count(query, function (err, count) {
                if (err) throw err;
                callback(count);
                db.close();
            })
        })
    },

}