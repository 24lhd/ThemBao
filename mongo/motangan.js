var Mongo = require('../config/MongoConnect');
var CollName = 'MoTaNgan'
// var strDate = new String(new Date());
// var pubDate = {
//     giay: strDate.split("T")[0].split(" ")[4].split(":")[2],
//     phut: strDate.split("T")[0].split(" ")[4].split(":")[1],
//     gio: strDate.split("T")[0].split(" ")[4].split(":")[0],
//     thu: strDate.split("T")[0].split(" ")[0],
//     ngay: strDate.split("T")[0].split(" ")[2],
//     thang: strDate.split("T")[0].split(" ")[1],
//     nam: strDate.split("T")[0].split(" ")[3],
// }
module.exports = {
    insertOne: function (content, query, callback) {
        Mongo(function (db) {
            db.collection(CollName).deleteMany(query, function (err, result) {
                var strDate = new String(new Date());
                if (err) throw err;
                content.pubDate = {
                    // second: new Date().getSeconds(),
                    // minute: new Date().getMinutes(),
                    // hour: new Date().getHours(),
                    // day: new Date().getDay(),
                    // month: new Date().getMonth(),
                    // year: new Date().getYear(),
                    // fullYear: new Date().getFullYear(),

                    giay: strDate.split("T")[0].split(" ")[4].split(":")[2],
                    phut: strDate.split("T")[0].split(" ")[4].split(":")[1],
                    gio: strDate.split("T")[0].split(" ")[4].split(":")[0],
                    thu: strDate.split("T")[0].split(" ")[0],
                    ngay: strDate.split("T")[0].split(" ")[2],
                    thang: strDate.split("T")[0].split(" ")[1],
                    nam: strDate.split("T")[0].split(" ")[3],
                }
                db.c
                console.log("-----------------> " + JSON.stringify(pubDate));
                ollection(CollName).insertOne(content, function (err, res) {
                    if (err) throw err;
                    callback();
                    console.log("Query chèn mô tả " + JSON.stringify(query))
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