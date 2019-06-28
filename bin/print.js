"use strict";

exports.__esModule = true;
function printError(errors) {
    var hasError = false;
    for (var filename in errors) {
        if (!hasError) {
            hasError = true;
        }
        console.log("\x1B[31m" + filename + "  " + errors[filename].statusCode + "  " + errors[filename].errInfo + "\x1B[0m");
    }
    if (hasError) {
        console.log("\u8BF7\u4F7F\u7528 \x1B[31mtinypngs --single \u56FE\u7247\u540D\x1B[0m \u538B\u7F29\u5931\u8D25\u7684\u56FE\u7247");
    }
}
exports.printError = printError;
function printResult(results) {
    for (var filename in results) {
        console.log("\x1B[32m" + filename + "  " + results[filename].status + "  " + results[filename].before + " -> " + results[filename].after + " " + results[filename].ratio + "\x1B[0m");
    }
}
exports.printResult = printResult;
function printHelp() {
    console.log("tinypngs                                 \x1B[1m\x1B[31m\u538B\u7F29\u5F53\u524D\u76EE\u5F55\u4E0B\u6240\u6709\u56FE\u7247,\u8F93\u5165\u76EE\u5F55\u4E3A\u5F53\u524D\u76EE\u5F55\x1B[0m");
    console.log("tinypngs --outdir test                   \x1B[1m\x1B[31m\u538B\u7F29\u5F53\u524D\u76EE\u5F55\u4E0B\u6240\u6709\u56FE\u7247,\u8F93\u5165\u76EE\u5F55\u4E3Atest\x1B[0m");
    console.log("tinypngs --single test.png               \x1B[1m\x1B[31m\u538B\u7F29\u5F53\u524D\u76EE\u5F55\u4E0Btest.png\u56FE\u7247,\u8F93\u51FA\u76EE\u5F55\u4E3A\u5F53\u524D\u76EE\u5F55\x1B[0m");
    console.log("tinypngs --outdir dist --single test.png \x1B[1m\x1B[31m\u538B\u7F29\u5F53\u524D\u76EE\u5F55\u4E0Btest.png\u56FE\u7247,\u8F93\u51FA\u76EE\u5F55\u4E3Adist\u76EE\u5F55\x1B[0m");
}
exports.printHelp = printHelp;