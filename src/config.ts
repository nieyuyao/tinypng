import { IncomingHttpHeaders } from "http";

interface ReqConfig {
  host: string;
  path?: string;
  method: string;
  rejectUnauthorized: boolean;
  headers?: IncomingHttpHeaders;
}

// 错误详情
export interface Error {
  [filename: string] : {
    status: number; // 0 图片读取失败 1 图片上传失败 2 图片下载失败 3 图片写入失败
    errInfo: string;
    statusCode?: number;
  }
}

// 压缩结果详情
export interface Result {
  [filename: string] : {
    status: number; // 5 成功
    before: number; // 压缩前大小
    after: number; // 压缩后大小
    ratio: string; // 压缩比
  }
}

export interface Param {
  [key: string]: string;
}

export const Errors = ['图片读取失败', '图片上传失败', '图片下载失败', '图片写入失败'];

export const headersConfig: IncomingHttpHeaders = {
  origin: "https://tinypng.com",
  // cookie: "_ga=GA1.2.348540694.1532179868; _gid=GA1.2.57501512.1560647966",
  referer: "https://tinypng.com/",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
};
/* 上传图片请求信息 */
export const uploadConfig: ReqConfig = {
  host: "tinypng.com",
  path: "/web/shrink",
  method: "POST",
  rejectUnauthorized: false
};

/* 下载图片请求信息 */
export const downloadConfig: ReqConfig = {
  host: "tinypng.com",
  method: "GET",
  rejectUnauthorized: false
};

export const imgReg: RegExp = /.*\.(png|jpe?g)$/;
export const extReg: RegExp = /\.(png|jpe?g)$/;
export const uploadDelay = 2000; // 网络请求延迟时间ms
export const downloadDelay = 300; // 网络请求延迟时间ms