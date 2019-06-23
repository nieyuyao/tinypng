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
var _this = undefined;
exports.__esModule = true;
var upload_1 = require("./upload");
var download_1 = require("./download");
var config_1 = require("./config");
var fs = require("fs");
var path = require("path");
var singleLineLog = require('single-line-log');
var ctxPath = process.cwd();
var argvs = process.argv;
var outDir = ctxPath; // 输出路径
if (argvs[2] && argvs[2] === "--outdir") {
    if (argvs[3]) {
        outDir = path.resolve(ctxPath, argvs[3]);
    }
}
console.log("\u786E\u5B9A\u8981\u538B\u7F29\u8BE5\u6587\u4EF6\u5939\u4E0B\u7684\u56FE\u7247?(\x1B[32myes/no\x1B[0m)");
// 读取目录下的文件
var files = fs.readdirSync(ctxPath, {
    withFileTypes: true
});
console.log("\x1B[32m\u5171" + files.length + "\u4E2A\u56FE\u7247\x1B[0m");
// 成功的个数， 失败的个数，详情
var success = 0;
var fail = 0;
var results = {};
var promises = files.map(function (filename) {
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
                        success++;
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        fail++;
                        // 上传失败
                        if (err_1.upload === false) {
                            results[filename] = {
                                status: 1,
                                errInfo: config_1.Errors[1]
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
    }();
});
function tiny() {
    return __awaiter(this, void 0, void 0, function () {
        var filename, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2,, 3]);
                    return [4 /*yield*/, Promise.all(promises)];
                case 1:
                    _a.sent();
                    console.log("\x1B[32m\uD83D\uDE04 " + success + "\u4E2A \uD83D\uDE30 \x1B[31m" + fail + "\u4E2A\x1B[0m");
                    for (filename in results) {
                        console.log("\x1B[31m" + filename + " " + results[filename].errInfo + "\x1B[0m");
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    return [3 /*break*/, 3];
                case 3:
                    return [2 /*return*/];
            }
        });
    });
}
tiny();