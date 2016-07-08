/**
 * Created by Administrator on 2016-07-07.
 */
var request = require("request");
var fs = require("fs");
var save = require("../update/save.js");
var read = require("../web/read.js");

//request('http://b.hiphotos.baidu.com/image/pic/item/810a19d8bc3eb135aa449355a21ea8d3fc1f4458.jpg').pipe(fs.createWriteStream('../resouces/img/aaa.jpg'));
//request('http://s13.sinaimg.cn/orignal/001Wf5K2gy72pUQ5Ufiec.jpg').pipe(fs.createWriteStream('../resouces/img/bbb.jpg'));

//获取网页图片
exports.getImg = function (url, callback) {
    function getFromInternet() {
        var realurl = './resouces/img/' + exports.guidGenerator() + '.jpg';
        try {
            request(url).pipe(fs.createWriteStream(realurl));
            save.imgSave(url, realurl, function (err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, realurl);
                }
            });
        } catch (e) {
            callback(e);
        }
    }

    read.imgPath(url, function (err, realpath) {
        if (err) {
            getFromInternet();
        } else {
            fs.exists(realpath,function(exist){
                if(!exist){
                    getFromInternet();
                }else {
                    callback(null, realpath);
                }
            });

        }
    });


};

exports.guidGenerator = function () {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
};