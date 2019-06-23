#!/usr/bin/env node
import upload from "./upload";
import download from "./download";
import { extReg, Result, Errors, imgReg } from "./config";
const fs = require("fs");
const path = require("path");
const log = require('single-line-log').stdout;
const readline = require('readline');
const ctxPath = process.cwd();

// 成功的个数， 失败的个数，详情
let success: number = 0;
let fail: number = 0;
let total: number = 0;
let files: Array<string>;
let tasks: Array<Promise<any>>;
const results: Result = {};

const argvs = process.argv;
let outDir = ctxPath; // 输出路径
if (argvs[2] && argvs[2] === "--outdir") {
  if (argvs[3]) {
    outDir = path.resolve(ctxPath, argvs[3]);
  }
}
/**
 *@description 读取目录下的文件
 */
function getFiles(): void {
  const _files = fs.readdirSync(ctxPath, {
    withFileTypes: true
  });
  files = _files.filter((file: string) => {
    return imgReg.test(file);
  });
  total = files.length;
  console.log(`\u001b[32m共${files.length}个图片\u001b[0m`);
}

/**
 * @description 创建任务
 */
function getTasks(): void {
  tasks = files.map((filename: string) => {
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
        log(`tinying...${Math.floor((success / total) * 100)}%\n`);
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
}

/**
 * @description 压缩图片
 */
async function tiny(): Promise<void> {
  try {
    await Promise.all(tasks);
    console.log(`\u001b[32m\uD83D\uDE04 ${success}个 \uD83D\uDE30 \u001b[31m${total-success}个\u001b[0m`);
    for (const filename in results) {
      console.log(`\u001b[31m${filename} ${results[filename].errInfo}\u001b[0m`);
    }
  }
  catch(err) {
    throw(err);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * @description 提示是否要压缩
 */
function question(): void {
  rl.question('\u001b[1m\u001b[31m确定要压缩该文件夹下的图片?\u001b[0m(\u001b[32myes/no\u001b[0m)', (awnser: string) => {
    if (awnser === '' || awnser === 'yes') {
      getFiles();
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



