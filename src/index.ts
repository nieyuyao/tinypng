#!/usr/bin/env node
import upload from "./upload";
import download from "./download";
import { extReg, Error, Errors, imgReg, Param, Result } from "./config";
import { printError, printResult } from './print';

const fs = require("fs");
const path = require("path");
const log = require('single-line-log').stdout;
const readline = require('readline');
const ctxPath = process.cwd();

let fail: number = 0; // 失败的个数
let total: number = 0; // 总数
let files: Array<string>; // 文件名数组
let tasks: Array<() => {}>;
const errors: Error = {}; // 错误详情
const results: Result = {}; // 结果详情

const argvs = process.argv;
let outDir = ctxPath; // 输出路径
let params:Param = {}; // 参数列表

/**
 * @description 获取命令行参数
 */
function getCommandParams(): void {
  for (let i = 2; i < argvs.length; i+=2) {
    const key = argvs[i];
    const value = argvs[i + 1];
    params[key] = value;
  }
  if (params.hasOwnProperty('--help')) {
    console.log(`tinypngs                                 \u001b[1m\u001b[31m压缩当前目录下所有图片,输入目录为当前目录\u001b[0m`);
    console.log(`tinypngs --outdir test                   \u001b[1m\u001b[31m压缩当前目录下所有图片,输入目录为test\u001b[0m`);
    console.log(`tinypngs --single test.png               \u001b[1m\u001b[31m压缩当前目录下test.png图片,输出目录为当前目录\u001b[0m`);
    console.log(`tinypngs --outdir dist --single test.png \u001b[1m\u001b[31m压缩当前目录下test.png图片,输出目录为dist目录\u001b[0m`);
    process.exit(1);
  }
  // 输出目录
  if (params['--outdir']) {
    outDir = path.resolve(ctxPath, params['--outdir']);
  }
  // 需要读取的文件
  let _files: Array<string>;
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
function getFiles(_files: Array<string>): void {
  files = _files.filter((file: string) => {
    return imgReg.test(file);
  });
  total = files.length;
  if (total === 0) {
    console.log(`\u001b[1m\u001b[31m未发现图片\u001b[0m`);
    process.exit(1);
  }
}

/**
 * @description 创建任务
 */
function getTasks(): void {
  tasks = files.map((filename: string) => {
    return async() => {
      try {
        const filePath = path.resolve(ctxPath, filename);
        const matches = filename.match(extReg);
        if (matches === null) {
          errors[filename] = {
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
        if (!uploadResult.before) {
          fail++;
          return;
        }
        const downloadResult = await download(location, filename);
        if (!downloadResult.buffer) {
          fail++;
          return;
        }
        if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir);
        }
        fs.writeFileSync(`${outDir}/${filename}`, downloadResult.buffer);
        results[filename] = {
          status: 5,
          before: uploadResult.before,
          after: downloadResult.buffer.length,
          ratio: `${Math.floor(downloadResult.buffer.length / uploadResult.before * 100)}%`
        };
      } catch (err) {
        fail++;
        // 上传失败
        if (err.upload === false) {
          errors[filename] = {
            status: 1,
            errInfo: Errors[1],
            statusCode: err.statusCode
          }
        } else if (err.download === false) {
          errors[filename] = {
            status: 2,
            errInfo: Errors[2],
            statusCode: err.statusCode
          }
        } else {
          errors[filename] = {
            status: 3,
            errInfo: Errors[3],
            statusCode: 10003
          }
        }
        console.log(err);
        process.exit(1);
      }
    };
  });
}

/**
 * @description 压缩图片
 */
async function tiny(): Promise<void> {
  try {
    for (let i = 0; i < total; i++) {
      log(`tinying...${Math.floor(((i + 1)/ total) * 100)}%\n`);
      await tasks[i]();
    }
    // 打印结果
    console.log(`\u001b[32m\uD83D\uDE04 ${total-fail}个 \uD83D\uDE30 \u001b[31m${fail}个\u001b[0m`);
    // 打印错误信息
    printError(errors);
    printResult(results);
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
  getCommandParams();
  rl.question('\u001b[1m\u001b[31m确定要压缩该文件夹下的图片?\u001b[0m(\u001b[32myes/no\u001b[0m)', (awnser: string) => {
    if (awnser === '' || awnser === 'yes') {
      console.log(`\u001b[32m共${files.length}个图片\u001b[0m`);
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



