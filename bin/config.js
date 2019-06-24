"use strict";

exports.__esModule = true;
exports.Errors = ['图片读取失败', '图片上传失败', '图片下载失败', '图片写入失败'];
exports.headersConfig = {
    origin: "https://tinypng.com",
    cookie: "_ga=GA1.2.348540694.1532179868; _gid=GA1.2.57501512.1560647966",
    referer: "https://tinypng.com/",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
};
/* 上传图片请求信息 */
exports.uploadConfig = {
    host: "tinypng.com",
    path: "/web/shrink",
    method: "POST",
    rejectUnauthorized: false
};
/* 下载图片请求信息 */
exports.downloadConfig = {
    host: "tinypng.com",
    method: "GET",
    rejectUnauthorized: false
};
exports.imgReg = /.*\.(png|jpe?g)$/;
exports.extReg = /\.(png|jpe?g)$/;
exports.maxConnections = 10; // 最大连接数
exports.reqeustDelay = 300; // 网络请求延迟时间ms