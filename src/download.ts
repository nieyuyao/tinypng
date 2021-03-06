import { downloadConfig, downloadDelay } from "./config";
import { ServerResponse } from "http";
const https = require("https");

interface PromiseValue {
  statusCode?: number;
  download: boolean;
  buffer?: Buffer;
}

/**
 * @description 下载图片
 * @param {String} location 远端图片路径
 * @param {String} filename 文件名
 */
const download = (
  location: string,
  filename: string
): Promise<PromiseValue> => {
  return new Promise((resolve, reject) => {
    let buffer = Buffer.alloc(0);
    const config = Object.assign({}, downloadConfig);
    config.path = encodeURI(`${location.substr(19)}/${filename}`);
    setTimeout(() => {
      const req = https.request(config, (res: ServerResponse) => {
      if (res.statusCode === 200) {
        res.on("data", (chunk: Buffer) => {
          buffer = Buffer.concat([buffer, chunk]);
        });
        res.on("end", () => {
          resolve({
            download: true,
            buffer,
            statusCode: 200
          });
        });
        res.on("err", () => {
          reject({
            download: false,
            statusCode: 10001
          });
        });
      } else {
        reject({
          download: false,
          statusCode: res.statusCode
        })
      }
      });
      req.end();
      req.on("error", (err: any) => {
        reject({
          download: false,
          statusCode: 10002
        });
      });
    }, downloadDelay);
  });
};
export default download;
