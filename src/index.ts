#!/usr/bin/env node
import upload from "./upload";
import download from "./download";
import { extReg, Result, Errors } from "./config";
const fs = require("fs");
const path = require("path");
const singleLineLog = require('single-line-log');
const ctxPath = process.cwd();

const argvs = process.argv;
let outDir = ctxPath; // 输出路径
if (argvs[2] && argvs[2] === "--outdir") {
  if (argvs[3]) {
    outDir = path.resolve(ctxPath, argvs[3]);
  }
}

console.log('确定要压缩该文件夹下的图片?(\u001b[32myes/no\u001b[0m)');

// 读取目录下的文件
const files = fs.readdirSync(ctxPath, {
  withFileTypes: true
});
console.log(`\u001b[32m共${files.length}个图片\u001b[0m`);

// 成功的个数， 失败的个数，详情
let success: number = 0;
let fail: number = 0;
const results: Result = {};

const promises = files.map((filename: string) => {
  return (async() => {
    try {
      const filePath = path.resolve(ctxPath, filename);
      const matches = filename.match(extReg);
      if (matches === null) {
        results[filename] = {
          status: 0,
          errInfo: Errors[0]
        }
        return;
      }
      const ext = matches[1];
      const uploadResult = await upload(filePath, ext);
      const location = uploadResult.location;
      if (!location) {
        fail++;
        return;
      }
      const downloadResult = await download(location, filename);
      if (!downloadResult.buffer) {
        fail++;
      }
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
      }
      fs.writeFileSync(`${outDir}/${filename}`, downloadResult.buffer);
      success++;
    } catch (err) {
      fail++;
      // 上传失败
      if (err.upload === false) {
        results[filename] = {
          status: 1,
          errInfo: Errors[1]
        }
      } else if (err.download === false) {
        results[filename] = {
          status: 2,
          errInfo: Errors[2]
        }
      } else {
        results[filename] = {
          status: 3,
          errInfo: Errors[3]
        }
      }
    }
  })();
});

async function tiny(): Promise<void> {
  try {
    await Promise.all(promises);
    console.log(`\u001b[32m\uD83D\uDE04 ${success}个 \uD83D\uDE30 \u001b[31m${fail}个\u001b[0m`);
    for (const filename in results) {
      console.log(`\u001b[31m${filename} ${results[filename].errInfo}\u001b[0m`);
    }
    process.exit(1);
  }
  catch(err) {
    process.exit(1);
  }
}
tiny();

