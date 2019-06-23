import { downloadConfig } from "./config";
import { ServerResponse } from "http";
const https = require("https");

interface PromiseValue {
  download: boolean;
  buffer?: Buffer;
}

// 下载图片
const download = (
  location: string,
  filename: string
): Promise<PromiseValue> => {
  return new Promise((resolve, reject) => {
    let buffer = Buffer.alloc(0);
    const config = Object.assign({}, downloadConfig);
    config.path = `${location.substr(19)}/${filename}`;
    const req = https.request(config, (res: ServerResponse) => {
      if (res.statusCode === 200) {
        res.on("data", (chunk: Buffer) => {
          buffer = Buffer.concat([buffer, chunk]);
        });
        res.on("end", () => {
          resolve({
            download: true,
            buffer
          });
        });
        res.on("err", () => {
          console.log("res err");
          reject({
            download: false
          });
        });
      } else {
        reject({
          download: false
        })
      }
    });
    req.end();
    req.on("error", () => {
      reject({
        download: false
      });
    });
  });
};
export default download;
