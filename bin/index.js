#!/usr/bin/env node

"use strict";

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = undefined && undefined.__generator || function (thisArg, body) {
    var _ = { label: 0, sent: function sent() {
            if (t[0] & 1) throw t[1];return t[1];
        }, trys: [], ops: [] },
        f,
        y,
        t,
        g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;
    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) {
            try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0:case 1:
                        t = op;break;
                    case 4:
                        _.label++;return { value: op[1], done: false };
                    case 5:
                        _.label++;y = op[1];op = [0];continue;
                    case 7:
                        op = _.ops.pop();_.trys.pop();continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;continue;
                        }
                        if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                            _.label = op[1];break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];t = op;break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];_.ops.push(op);break;
                        }
                        if (t[2]) _.ops.pop();
                        _.trys.pop();continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [6, e];y = 0;
            } finally {
                f = t = 0;
            }
        }if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var upload_1 = require("./upload");
var download_1 = require("./download");
var config_1 = require("./config");
var fs = require("fs");
var path = require("path");
var log = require('single-line-log').stdout;
var readline = require('readline');
var ctxPath = process.cwd();
var fail = 0; // 失败的个数
var total = 0; // 总数
var files; // 文件名数组
var fi = 0; // 当前正在遍历第几个文件
var tasks;
var results = {};
var argvs = process.argv;
var outDir = ctxPath; // 输出路径
var aFile;
var params = {};
/**
 * @description 获取命令行参数
 */
function getCommandParams() {
    for (var i = 2; i < argvs.length; i += 2) {
        var key = argvs[i];
        var value = argvs[i + 1];
        params[key] = value;
    }
    // 输出目录
    if (params['--outdir']) {
        outDir = path.resolve(ctxPath, params['--outdir']);
    }
    // 需要读取的文件
    var _files;
    if (params['--single']) {
        _files = [params['--single']];
    } else {
        _files = fs.readdirSync(ctxPath, {
            withFileTypes: true
        });
    }
    getFiles(_files);
}
/**
 *@description 读取目录下的文件
 */
function getFiles(_files) {
    files = _files.filter(function (file) {
        return config_1.imgReg.test(file);
    });
    total = files.length;
    console.log("\x1B[32m\u5171" + files.length + "\u4E2A\u56FE\u7247\x1B[0m");
}
/**
 * @description 创建任务
 */
function getTasks() {
    var _this = this;
    tasks = files.map(function (filename) {
        return function () {
            return __awaiter(_this, void 0, void 0, function () {
                var filePath, matches, ext, uploadResult, location_1, downloadResult, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3,, 4]);
                            filePath = path.resolve(ctxPath, filename);
                            matches = filename.match(config_1.extReg);
                            if (matches === null) {
                                results[filename] = {
                                    status: 0,
                                    errInfo: config_1.Errors[0]
                                };
                                return [2 /*return*/];
                            }
                            ext = matches[1];
                            return [4 /*yield*/, upload_1["default"](filePath, ext)];
                        case 1:
                            uploadResult = _a.sent();
                            location_1 = uploadResult.location;
                            if (!location_1) {
                                fail++;
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, download_1["default"](location_1, filename)];
                        case 2:
                            downloadResult = _a.sent();
                            if (!downloadResult.buffer) {
                                fail++;
                            }
                            if (!fs.existsSync(outDir)) {
                                fs.mkdirSync(outDir);
                            }
                            fs.writeFileSync(outDir + "/" + filename, downloadResult.buffer);
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _a.sent();
                            fail++;
                            // 上传失败
                            if (err_1.upload === false) {
                                results[filename] = {
                                    status: 1,
                                    errInfo: config_1.Errors[1],
                                    statusCode: err_1.statusCode
                                };
                            } else if (err_1.download === false) {
                                results[filename] = {
                                    status: 2,
                                    errInfo: config_1.Errors[2]
                                };
                            } else {
                                results[filename] = {
                                    status: 3,
                                    errInfo: config_1.Errors[3]
                                };
                            }
                            return [3 /*break*/, 4];
                        case 4:
                            return [2 /*return*/];
                    }
                });
            });
        };
    });
}
/**
 * @description 压缩图片
 */
function tiny() {
    return __awaiter(this, void 0, void 0, function () {
        var end, i, filename, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8,, 9]);
                    end = Math.min.call(null, tasks.length - fi, config_1.maxConnections);
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < end)) return [3 /*break*/, 4];
                    log("tinying..." + Math.floor((fi + 1) / total * 100) + "%\n");
                    return [4 /*yield*/, tasks[fi]()];
                case 2:
                    _a.sent();
                    fi++;
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (!(fi < total)) return [3 /*break*/, 6];
                    return [4 /*yield*/, tiny()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    // 打印结果
                    console.log("\x1B[32m\uD83D\uDE04 " + (total - fail) + "\u4E2A \uD83D\uDE30 \x1B[31m" + fail + "\u4E2A\x1B[0m");
                    // 打印错误信息
                    for (filename in results) {
                        console.log("\x1B[31m" + filename + "  " + results[filename].statusCode + "  " + results[filename].errInfo + "\x1B[0m");
                    }
                    _a.label = 7;
                case 7:
                    return [3 /*break*/, 9];
                case 8:
                    err_2 = _a.sent();
                    throw err_2;
                case 9:
                    return [2 /*return*/];
            }
        });
    });
}
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
/**
 * @description 提示是否要压缩
 */
function question() {
    rl.question("\x1B[1m\x1B[31m\u786E\u5B9A\u8981\u538B\u7F29\u8BE5\u6587\u4EF6\u5939\u4E0B\u7684\u56FE\u7247?\x1B[0m(\x1B[32myes/no\x1B[0m)", function (awnser) {
        if (awnser === '' || awnser === 'yes') {
            getCommandParams();
            getTasks();
            tiny();
            rl.close();
        } else if (awnser === 'no') {
            rl.close();
        } else {
            question();
        }
    });
}
question();