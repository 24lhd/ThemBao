var listCate = {
    item: [{
        linknew: 'http://vnexpress.net/',
        name: 'Tin mới nhất',
        link: 'http://vnexpress.net/rss/tin-moi-nhat.rss'
    },
        {
            linknew: 'http://vnexpress.net/',
            name: 'Thời sự',
            link: 'http://vnexpress.net/rss/thoi-su.rss'
        },
        {
            linknew: 'http://vnexpress.net/',
            name: 'Kinh Doanh',
            link: 'http://vnexpress.net/rss/kinh-doanh.rss'
        },
        {
            linknew: 'http://vnexpress.net/',
            name: 'Startup',
            link: 'http://vnexpress.net/rss/startup.rss'
        },
        {
            linknew: 'http://vnexpress.net/',
            name: 'Giải trí',
            link: 'http://vnexpress.net/rss/giai-tri.rss'
        },
        {
            linknew: 'http://vnexpress.net/',
            name: 'Thể thao',
            link: 'http://vnexpress.net/rss/the-thao.rss'
        },
        {
            linknew: 'http://vnexpress.net/',
            name: 'Pháp luật',
            link: 'http://vnexpress.net/rss/phap-luat.rss'
        },
        {
            linknew: 'http://vnexpress.net/',
            name: 'Giáo dục',
            link: 'http://vnexpress.net/rss/giao-duc.rss'
        },
        {
            linknew: 'http://vnexpress.net/',
            name: 'Sức khỏe',
            link: 'http://vnexpress.net/rss/suc-khoe.rss'
        },
        {
            linknew: 'http://vnexpress.net/',
            name: 'Gia đình',
            link: 'http://vnexpress.net/rss/gia-dinh.rss'
        },
        {
            linknew: 'http://vnexpress.net/',
            name: 'Du lịch',
            link: 'http://vnexpress.net/rss/du-lich.rss'
        },
        {
            linknew: 'http://vnexpress.net/',
            name: 'Khoa học',
            link: 'http://vnexpress.net/rss/khoa-hoc.rss'
        },
        {
            linknew: 'http://vnexpress.net/',
            name: 'Số hóa',
            link: 'http://vnexpress.net/rss/so-hoa.rss'
        },
        {
            linknew: 'http://vnexpress.net/',
            name: 'Cộng đồng',
            link: 'http://vnexpress.net/rss/cong-dong.rss'
        },
        {
            linknew: 'http://vnexpress.net/',
            name: 'Xe',
            link: 'http://vnexpress.net/rss/oto-xe-may.rss'
        },
        {
            linknew: 'http://vnexpress.net/',
            name: 'Tâm sự',
            link: 'http://vnexpress.net/rss/tam-su.rss'
        },
        {
            linknew: 'http://vnexpress.net/',
            name: 'Cười',
            link: 'http://vnexpress.net/rss/cuoi.rss'
        },


    ]
}
module.exports = function () {
    var mongo = require('mongodb');
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/mydb";
    var request = require('request')
    var cheerio = require('cheerio')
    var xml2js = require('xml2js')
    var parser = new xml2js.Parser()
    var ind = 0;
    var sizeCategory = listCate.item.length;
    var arrCate = new Array();

    function chayCategory(indexCategory) {
        var linkCategory = listCate.item[indexCategory].link
        request(
            linkCategory,
            function (error, res, htmlBody) {
                //   console.log(htmlBody)// l?y ???c xml
                if (!error && res.statusCode == 200) {
                    parser.parseString(// chuy?n t? xml sang json
                        htmlBody,
                        function (err, data) {//data l? ki?u json
                            var arrItemDes = data.rss.channel[0].item;

                            function chayItemDes(indexItemDes) {
                                try {
                                    var linkCategory = data.rss.channel[0].link[0]
                                    var itemInCate = arrItemDes[indexItemDes];
                                    var ObjItemInCate = {
                                        linkCategory: linkCategory,
                                        linkContents: itemInCate.link[0],
                                        title: itemInCate.title[0],
                                        description: itemInCate.description[0].split("</br>")[1],
                                        img: itemInCate.description[0].split("src=\"")[1].split('" ></a>')[0],
                                        pubDate: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                                    }
                                    MongoClient.connect(url, function (err, db) {
                                        if (err) throw err;
                                        var query = { linkContents: ObjItemInCate.linkContents };
                                        db.collection("Des").find(query).toArray(function(err, result) {
                                            if (err) throw err;
                                            if (result[0]==null){
                                                db.collection("Des").insertOne(ObjItemInCate, function (err, res) {
                                                    if (err) throw err;
                                                    arrCate.push(ObjItemInCate.linkContents)
                                                });
                                            }
                                            db.close();
                                        });

                                    });



                                    if (indexItemDes < arrItemDes.length - 1) {
                                        chayItemDes(indexItemDes + 1);
                                    }
                                } catch (exc) {
                                }
                            }

                            chayItemDes(0);
                            if (indexCategory < sizeCategory - 1) {
                                chayCategory(indexCategory + 1)
                            } else {
                                console.log("Xong" + arrCate.length)
                                readHTMLItemVnExpress(0);
                            }
                        }
                    )
                }
            }
        )
    }

    chayCategory(0);

    function readHTMLItemVnExpress(index_con) {
        var jsdom = require("jsdom/lib/old-api.js");
        jsdom.env(
            arrCate[index_con],
            ["http://code.jquery.com/jquery.js"],
            function (err, window) {

                var content = window.$("#left_calculator").html();
                if (content == undefined) {
                    try {
                        content = window.$("script").text().split("VideoVNE.config_play")[1].split("};")[0];
                        s240 = new String(content.replace("=", "") + "}").split(`s240: '`)[1].split(`',`)[0]
                        s360 = new String(content.replace("=", "") + "}").split(`s360: '`)[1].split(`',`)[0]
                        s480 = new String(content.replace("=", "") + "}").split(`s480: '`)[1].split(`',`)[0]
                        s720 = new String(content.replace("=", "") + "}").split(`s720: '`)[1].split(`',`)[0]
                        linkVideo = s720;
                        if (linkVideo == '') linkVideo = s480;
                        else if (linkVideo == '') linkVideo = s360;
                        else if (linkVideo == '') linkVideo = s240;
                        content = `<video src="${linkVideo}"
       controls>
</video>`
                    } catch (error) {
                        if (index_con < arrCate.length - 1) {
                            readHTMLItemVnExpress(index_con + 1)
                            return;
                        }
                    }
                }
                var contents = {
                    linkContents: arrCate[index_con],
                    contentHTML: `
                    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        video {
            width: 100%;
            margin: auto;
        }
        img {
            width: 100%;
            display: block;
            margin: 0 auto;
        }
        table{
            width: 100%;
            margin: auto;
        }
    </style>
</head>
<body>${content}</body>
</html>`,
                }
                MongoClient.connect(url, function (err, db) {
                    if (err) throw err;
                    console.log("Contents" + arrCate[index_con]);
                    db.collection("Contents").insertOne(contents, function (err, res) {
                        if (err) throw err;
                        console.log("1 record Contents");
                        db.close();
                        if (index_con < arrCate.length - 1)
                            readHTMLItemVnExpress(index_con + 1)
                        return;
                    });
                });
            }
        );
    }
}