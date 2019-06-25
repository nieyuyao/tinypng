#!/usr/bin/env node
import upload from "./upload";
import download from "./download";
import { extReg, Result, Errors, imgReg, maxConnections, Param } from "./config";
const fs = require("fs");
const path = require("path");
const log = require('single-line-log').stdout;
const readline = require('readline');
const ctxPath = process.cwd();

let fail: number = 0; // 失败的个数
let total: number = 0; // 总数
let files: Array<string>; // 文件名数组
let fi: number = 0; // 当前正在遍历第几个文件
let tasks: Array<() => {}>;
const results: Result = {};

const argvs = process.argv;
let outDir = ctxPath; // 输出路径
let aFile: string;
let params:Param = {};

/**
 * @description 获取命令行参数
 */
function getCommandParams(): void {
  for (let i = 2; i < argvs.length; i+=2) {
    const key = argvs[i];
    const value = argvs[i + 1];
    params[key] = value;
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
  console.log(`\u001b[32m共${files.length}个图片\u001b[0m`);
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
      } catch (err) {
        fail++;
        // 上传失败
        if (err.upload === false) {
          results[filename] = {
            status: 1,
            errInfo: Errors[1],
            statusCode: err.statusCode
          }
        } else if (err.download === false) {
          results[filename] = {
            status: 2,
            errInfo: Errors[2],
            statusCode: err.statusCode
          }
        } else {
          results[filename] = {
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
    const end = Math.min(tasks.length - fi, maxConnections);
    for (let i = 0; i < end; i++) {
      log(`tinying...${Math.floor(((fi + 1)/ total) * 100)}%\n`);
      await tasks[fi]();
      fi++;
    }
    if (fi < total) {
      await tiny();
    } else {
      // 打印结果
      console.log(`\u001b[32m\uD83D\uDE04 ${total-fail}个 \uD83D\uDE30 \u001b[31m${fail}个\u001b[0m`);
      // 打印错误信息
      let hasError: boolean = false;
      for (const filename in results) {
        if (!hasError) {
          hasError = true;
        }
        console.log(`\u001b[31m${filename}  ${results[filename].statusCode}  ${results[filename].errInfo}\u001b[0m`);
      }
      if (hasError) {
        console.log(`请使用 tinypngs --single 图片名 压缩失败的图片`);
      }
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



