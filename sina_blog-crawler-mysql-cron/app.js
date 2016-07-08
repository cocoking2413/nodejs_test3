var path = require('path');
var express = require('express');
var spawn = require('child_process').spawn;
var cronJob = require('cron').CronJob;
var read = require('./web/read');
var config = require('./config');
var url = require("url");
var fs = require("fs");

var app = express();

// 配置 express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/resouces')));
console.log(path.join(__dirname, '/resouces'));

// 网站首页
app.get('/', function (req, res, next) {
    // articleListByClassId 的第一个参数是文章分类的 ID
    // 第二个参数是返回结果的开始位置
    // 第三个参数是返回结果的数量
    read.articleListByClassId(0, 0, 20, function (err, list) {
        if (err) return next(err);
        read.classList(function (err, list2) {
            if (err) {
                list2 = [];
            }
            // 渲染模板
            res.locals.articleList = list;
            res.locals.classlist = list2;
            res.render('index');
        });
    });
});
// 文章页面
app.get('/class/:id', function (req, res, next) {
    read.articleListByClassId(req.params.id, 0, 20, function (err, list) {
        if (err) return next(err);
        read.classList(function (err, list2) {
            if (err) {
                list2 = [];
            }
            // 渲染模板
            res.locals.articleList = list;
            res.locals.classlist = list2;
            res.render('index');
        });
    });
});

var getImg = require("./web/request_test.js");
var querystring = require("querystring");
app.get('/img', function (req, res, next) {
    console.log(1);
    var req_url = querystring.parse(url.parse(req.url).query);
    console.log(req_url.url);
    getImg.getImg(req_url.url, function (err, realurl) {
        if (err)return next(err);
        fs.exists(realurl, function (exist) {
            if (exist) {
                fs.readFile(realurl, function (err, img) {
                    if (err)return next(err);
                    res.end(img);
                });
            } else return next("404");
        });
    });
});


// 文章页面
app.get('/article/:id', function (req, res, next) {
    // 通过 req.params.id 来取得 URL 中 :id 部分的参数
    read.article(req.params.id, function (err, article) {
        if (err) return next(err);

        // 渲染模板
        res.locals.article = article;
        res.render('article');
    });
});

app.listen(config.port);
console.log('服务器已启动');


// 定时执行更新任务
function updateData() {
    try {
        var update = spawn(process.execPath, [path.resolve(__dirname, 'update/all.js')]);
        update.stdout.pipe(process.stdout);
        update.stderr.pipe(process.stderr);
        update.on('close', function (code) {
            console.log('更新任务结束，代码=%d', code);
        });
    } catch (e) {
        console.log(e.stack);
    }
}
function clearData() {
    //清除数据库
    require("./update/save.js").clearTablesData(function (err) {
        if (err)console.log(err);
    });
    //清除img图片
    var img_path = path.join(__dirname, "/resouces/img");

    function deleteFolder(url) {
        if (fs.existsSync(url)) {
            var files = fs.readdirSync(url);
            files.forEach(function (file,index) {
                var filePath = path.join(url, file);
                console.log(filePath);
                if (fs.statSync(filePath).isDirectory()) {
                    deleteFolder(filePath);
                } else {
                    fs.unlinkSync(filePath);
                }
            });
            if(url!=img_path) fs.rmdirSync(url);
        }
        else {
            console.log(url + "文件夹不存在！");
        }
    }

    deleteFolder(img_path);

    if(!fs.existsSync(img_path)){
        fs.mkdirSync(img_path);
        console.log("创建文件夹，path:"+img_path);
    }
}
clearData();
updateData();
var job = new cronJob(config.autoUpdate, function () {
    console.log('开始执行定时更新任务');
    updateData();
});
job.start();


process.on('uncaughtException', function (err) {
    console.error('uncaughtException: %s', err.stack);
});