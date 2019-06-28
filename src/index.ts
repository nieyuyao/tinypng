#!/usr/bin/env node
import upload from "./upload";
import download from "./download";
import { extReg, Error, Errors, imgReg, Result } from "./config";
import { printError, printResult, printHelp } from './print';

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
let isSingle: boolean = false;

const argvs = process.argv;
let outDir = ctxPath; // 输出路径

/**
 * @description 获取命令行参数
 */
function getCommandParams(): void {
  if (argvs[2] === '--version') {
    console.log(require('../package').version);
    process.exit(1);
  }
  if (argvs[2] === '--help') {
    printHelp();
    process.exit(1);
  }
  // 需要读取的文件
  let _files: Array<string>;
  if (!argvs[2]) {
    _files = fs.readdirSync(ctxPath, {
      withFileTypes: true
    });
    getFiles(_files);
    return;
  };

  // 输出目录
  if (argvs[2] === '--outdir') {
    if (!argvs[3]) {
      console.log('\u001b[31m请指定输出目录\u001b[0m');
      process.exit(1);
    }
    outDir = path.resolve(ctxPath, argvs[3]);
    if (!argvs[4]) {
      _files = fs.readdirSync(ctxPath, {
        withFileTypes: true
      });
      getFiles(_files);
      return;
    }
    if (argvs[4] === '--single' && argvs[5]) {
      isSingle = true;
      _files = [argvs[5]];
      getFiles(_files);
      return;
    }
    console.log('相似的命令是 tinypngs --outdir dist --single test.png');
    process.exit(1);
  } else if (argvs[2] === '--single') {
    isSingle = true;
    if (!argvs[3]) {
      console.log('\u001b[31m请指定输出文件名\u001b[0m');
      process.exit(1);
    }
    _files = [argvs[3]];
    getFiles(_files);
    return;
  }
  console.log('\u001b[1m\u001b[31m没有相关命令\u001b[0m');
  printHelp();
  process.exit(1);
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
    console.log('\u001b[1m\u001b[31m未发现图片\u001b[0m');
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
  rl.question(`\u001b[1m\u001b[31m确定要压缩该${isSingle ? '' : '文件夹下的'}图片?\u001b[0m(\u001b[32myes/no\u001b[0m)`, (awnser: string) => {
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