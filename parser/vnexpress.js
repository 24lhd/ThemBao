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
    var request = require('request')
    var cheerio = require('cheerio')
    var noidung = require('../mongo/noidung')
    var motangan = require('../mongo/motangan')
    var xml2js = require('xml2js')
    var parser = new xml2js.Parser()
    var ind = 0;
    var sizeCategory = listCate.item.length;

    function chayCategory(indexCategory) {
        console.log("chayCategory " + indexCategory)
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
                                    var date = new Date();
                                    var ObjItemInCate = {
                                        linkCategory: linkCategory,
                                        linkContents: itemInCate.link[0],
                                        title: itemInCate.title[0],
                                        description: itemInCate.description[0].split("</br>")[1],
                                        img: itemInCate.description[0].split("src=\"")[1].split('" ></a>')[0],
                                        pubDate: {
                                            second: new Date().getSeconds(),
                                            minute: new Date().getMinutes(),
                                            hour: new Date().getHours(),
                                            day: new Date().getDay(),
                                            month: new Date().getMonth(),
                                            year: new Date().getYear(),
                                            fullYear: new Date().getFullYear(),


                                        },
                                    }
                                    console.log("second " + ObjItemInCate.pubDate.second)
                                    try {

                                        readHTMLItemVnExpress(ObjItemInCate.linkContents, function (flag) {
                                            if (flag) {
                                                motangan.insertOne(ObjItemInCate, {linkContents: ObjItemInCate.linkContents}, function () {
                                                    console.log("push")
                                                    if (indexItemDes < arrItemDes.length - 1) {
                                                        chayItemDes(indexItemDes + 1);
                                                    }
                                                })
                                            } else if (indexItemDes < arrItemDes.length - 1) {
                                                chayItemDes(indexItemDes + 1);
                                            }

                                        })
                                    } catch (e) {
                                        if (indexItemDes < arrItemDes.length - 1) {
                                            chayItemDes(indexItemDes + 1);
                                        }
                                    }


                                } catch (exc) {
                                    console.log(exc)
                                }
                            }

                            chayItemDes(0);
                            if (indexCategory < sizeCategory - 1) {
                                chayCategory(indexCategory + 1)
                            } else {
                                chayCategory(0);
                                // require('../mongo/motangan').findQueryLimit({"pubDate.day": new Date().getDay()}, 1000, function (res) {
                                //     arrMotaNgan = res;
                                //     console.log("Xong arrMotaNgan" + arrMotaNgan.length)
                                //     readHTMLItemVnExpress(0);
                                // })

                            }
                        }
                    )
                }
            }
        )
    }

    var arrMotaNgan = new Array();
    chayCategory(0);
    var jsdom = require("jsdom/lib/old-api.js");

    function readHTMLItemVnExpress(index_con, call) {
        console.log('readHTMLItemVnExpress ' + index_con)
        console.log('arrMotaNgan ' + arrMotaNgan.length)
        jsdom.env(
            // arrMotaNgan[index_con].linkContents,
            index_con,
            ["http://code.jquery.com/jquery.js"],
            function (err, window) {
                var content = window.$("#left_calculator").html();
                var title = window.$(".title_news").html();
                if (title == undefined) title = `<h1>${window.$("title").html()}</h1>`
                console.log(title);
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
                        content = `<video src="${linkVideo}"controls></video>`
                    } catch (e) {
                        // if (index_con < arrMotaNgan.length - 1)
                        //     readHTMLItemVnExpress(index_con + 1)
                        // else chayCategory(0);
                    }

                }
                var contents = {
                    // linkContents: arrMotaNgan[index_con].linkContents,
                    index_con,
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
          .block_timer_share{
            display: none;
        }
        .block_timer {
            display: none;
        }
        .social_share {
            display: none;
        }
        .xemthem_new_ver  {
            display: none;
        }
        .title_news{
            display: none;
        }
        #box_tinlienquan{
            display: none;
        }
          .block_goithutoasoan{
            display: none;
        }
    </style>
</head>
<body>${title}${content}</body>
</html>`,
                }
                noidung.insertOne(contents,
                    // {"linkContents": arrMotaNgan[index_con].linkContents}
                    {"linkContents": index_con}
                    , function () {
                        call(true);
                        // if (index_con < arrMotaNgan.length - 1)
                        //     readHTMLItemVnExpress(index_con + 1)
                        // else chayCategory(0);
                    });
            }
        );
    }

}