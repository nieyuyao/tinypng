"use strict";

exports.__esModule = true;
var config_1 = require("./config");
var https = require("https");
var fs = require("fs");
// 上传图片
var upload = function upload(filePath, ext) {
    return new Promise(function (resolve, reject) {
        var config = Object.assign({}, config_1.uploadConfig);
        var headers = Object.assign({}, config_1.headersConfig);
        headers["content-type"] = "image/" + ext;
        config.headers = headers;
        var req = https.request(config, function (res) {
            // 图片上传成功
            if (res.statusCode === 201) {
                resolve({
                    upload: true,
                    location: res.headers.location
                });
            } else {
                reject({
                    upload: false
                });
            }
        });
        var data = fs.readFileSync(filePath);
        req.write(data);
        req.end();
        req.on("error", function (err) {
            reject({
                upload: false
            });
        });
    });
};
exports["default"] = upload;