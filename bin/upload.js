"use strict";

exports.__esModule = true;
var config_1 = require("./config");
var https = require("https");
var fs = require("fs");
/**
 * @description
 * @param  {String} filePath 图片路径
 * @param {String} ext 图片后缀
 */
var upload = function upload(filePath, ext) {
    return new Promise(function (resolve, reject) {
        var config = Object.assign({}, config_1.uploadConfig);
        var headers = Object.assign({}, config_1.headersConfig);
        headers["content-type"] = "image/" + ext;
        config.headers = headers;
        setTimeout(function () {
            var req = https.request(config, function (res) {
                // 图片上传成功
                if (res.statusCode === 201) {
                    resolve({
                        upload: true,
                        location: res.headers.location
                    });
                } else {
                    reject({
                        upload: false,
                        statusCode: res.statusCode
                    });
                }
            });
            var data = fs.readFileSync(filePath);
            req.write(data);
            req.end();
            req.on("error", function (err) {
                reject({
                    upload: false,
                    statusCode: 10000
                });
            });
        }, config_1.reqeustDelay);
    });
};
exports["default"] = upload;