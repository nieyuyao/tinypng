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