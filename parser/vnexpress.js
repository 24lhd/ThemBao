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
var mongo = require('mongodb');
var request = require('request')
var cheerio = require('cheerio')
var noidung = require('../mongo/noidung')
var motangan = require('../mongo/motangan')
var xml2js = require('xml2js')
var parser = new xml2js.Parser()
var sizeCategory = listCate.item.length;
var jsdom = require("jsdom/lib/old-api.js");

module.exports = function () {
    var ArrayMotaNgan = [];
    var ArrayNoiDung = [];
    function chayCategory(indexCategory) {
        var linkCategory = listCate.item[indexCategory].link // lấy link một mục trên rss
        console.log("Chạy thể loại : " + listCate.item[indexCategory].name)
        request( // lấy các mô tả qua linh một mục
            linkCategory,
            function (error, res, htmlBody) {
                if (!error && res.statusCode == 200) {
                    parser.parseString(
                        htmlBody,
                        function (err, data) {
                            var listMoTaNgan = data.rss.channel[0].item;
                            var sizeListMoTaNgan = data.rss.channel[0].item.length;
                            for (indexMoTaNgan in listMoTaNgan) {
                                var itemMoTaNgan = listMoTaNgan[indexMoTaNgan];
                                // console.log(indexMoTaNgan + ", " + itemMoTaNgan.title)
                                try {
                                    var objMoTaNgan = {
                                        linkCategory: linkCategory,
                                        linkContents: itemMoTaNgan.link[0],
                                        title: itemMoTaNgan.title[0],
                                        description: itemMoTaNgan.description[0].split(`</br>`)[1],
                                        img: itemMoTaNgan.description[0].split(`src=\"`)[1].split(`"`)[0],
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
                                    motangan.insertOne(objMoTaNgan, {"linkContents": objMoTaNgan.linkContents}, function () {

                                    });
                                    ArrayMotaNgan.push(objMoTaNgan);
                                } catch (e) {
                                    console.log(`lỗi ${e}`);
                                }

                            }// for
                            console.log(`ArrayMotaNgan ${ArrayMotaNgan.length}`);

                            function getHTML(indexMoTaNgan) {
                                var objMoTaNgan = ArrayMotaNgan[indexMoTaNgan];
                                jsdom.env(
                                    objMoTaNgan.linkContents,
                                    ["http://code.jquery.com/jquery.js"],
                                    function (err, window) {
                                        try {
                                            var content = window.$("#left_calculator").html();
                                            var title = `<h1>${window.$("title").html().split("-")[0]}</h1>`
                                            console.log(indexMoTaNgan+" "+title);
                                            if (content == undefined) {
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
                                            }
                                            var contents = {
                                                linkContents: objMoTaNgan.linkContents,
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
                                            ArrayNoiDung.push(contents);
                                            if (indexMoTaNgan < ArrayMotaNgan.length - 1) getHTML(indexMoTaNgan + 1);
                                            else if (indexCategory < sizeCategory - 1) {
                                                for (indexNoiDung in ArrayNoiDung) {
                                                    noidung.insertOne(ArrayNoiDung[indexNoiDung], {"linkContents": ArrayNoiDung[indexNoiDung].linkContents}, function () {
                                                    });// noidung.insertOne
                                                }// for (indexNoiDung in ArrayNoiDung){
                                                ArrayNoiDung = [];
                                                ArrayMotaNgan = [];
                                                chayCategory(indexCategory + 1)
                                            }// else if
                                        } catch (e) {
                                            if (indexMoTaNgan < ArrayMotaNgan.length - 1) getHTML(indexMoTaNgan + 1);
                                            else if (indexCategory < sizeCategory - 1) {
                                                ArrayNoiDung = [];
                                                ArrayMotaNgan = [];
                                                chayCategory(indexCategory + 1)
                                            }// else if
                                        }
                                    });
                            }//function getHTML
                            getHTML(0);
                        }
                    )//------------------parser.parserString--------------------
                }
            }
        )
    }

    chayCategory(0);
}