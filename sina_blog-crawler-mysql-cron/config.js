// MySQL数据库连接配置
var mysql = require('mysql');
exports.db = mysql.createConnection({
    host: 'localhost',   // 数据库地址
    port: 3306,          // 数据库端口
    database: 'sina_blog',   // 数据库名称
    user: 'root',        // 数据库用户
    password: '123'             // 数据库用户对应的密码
});

// 博客配置
exports.sinaBlog = {
    //url: 'http://blog.sina.com.cn/u/1776757314'  // 博客首页地址
  //  url:'http://blog.sina.com.cn/u/3125927617'

    url:'http://blog.sina.com.cn/xuxiaoming8'
};

// Web服务器端口
exports.port = 3000;

// 定时更新
exports.autoUpdate = '0 */30 * * * *';  // 任务执行规则，参考 cron 语法
