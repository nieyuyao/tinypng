"use strict";

exports.__esModule = true;
var config_1 = require("./config");
var https = require("https");
/**
 * @description 下载图片
 * @param {String} location 远端图片路径
 * @param {String} filename 文件名
 */
var download = function download(location, filename) {
    return new Promise(function (resolve, reject) {
        var buffer = Buffer.alloc(0);
        var config = Object.assign({}, config_1.downloadConfig);
        config.path = location.substr(19) + "/" + filename;
        var req = https.request(config, function (res) {
            if (res.statusCode === 200) {
                res.on("data", function (chunk) {
                    buffer = Buffer.concat([buffer, chunk]);
                });
                res.on("end", function () {
                    resolve({
                        download: true,
                        buffer: buffer
                    });
                });
                res.on("err", function () {
                    console.log("res err");
                    reject({
                        download: false
                    });
                });
            } else {
                reject({
                    download: false
                });
            }
        });
        req.end();
        req.on("error", function () {
            reject({
                download: false
            });
        });
    });
};
exports["default"] = download;