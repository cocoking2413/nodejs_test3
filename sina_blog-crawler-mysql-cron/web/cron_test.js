/**
 * Created by Administrator on 2016-07-06.
 */
var cron = require("cron").CronJob;
var config = require("../config");
// 定时执行更新任务
var job = new cron("0 */1 * * * *", function () {
    console.log('开始执行定时更新任务');
});
job.start();