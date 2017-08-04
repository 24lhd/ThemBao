var Mongo = require('../config/MongoConnect');
var CollName = 'MoTaNgan'

module.exports = {
    insertOne: function (content, query, callback) {
        Mongo(function (db) {
            db.collection(CollName).deleteMany(query, function (err, result) {
                if (err) throw err;
                var date = new Date();
                var path = date.toISOString().split("Z")[0].split("T");
                content.pubDate = {
                    phut: path[1].split(":")[1],
                    gio: path[1].split(":")[0],
                    ngay: path[0].split("-")[2],
                    thang: path[0].split("-")[1],
                    nam: path[0].split("-")[0],
                }
                console.log(JSON.stringify( content.pubDate ));
                db.collection(CollName).insertOne(content, function (err, res) {
                    if (err) throw err;
                    callback();
                    // console.log("Query chèn mô tả " + JSON.stringify(query))
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