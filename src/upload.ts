import { uploadConfig, headersConfig, uploadDelay } from "./config";
import { IncomingMessage } from "http";
const https = require("https");
const fs = require("fs");

interface PromiseValue {
  statusCode?: number;
  upload: boolean;
  location?: string;
  before?: number;
}

/**
 * @description 
 * @param  {String} filePath 图片路径
 * @param {String} ext 图片后缀
 */
const upload = (filePath: string, ext: string): Promise<PromiseValue> => {
  return new Promise((resolve, reject) => {
    const config = Object.assign({}, uploadConfig);
    const headers = Object.assign({}, headersConfig);
    headers["content-type"] = `image/${ext}`;
    config.headers = headers;
    const data = fs.readFileSync(filePath);
    setTimeout(() => {
      const req = https.request(config, (res: IncomingMessage) => {
        // 图片上传成功
        if (res.statusCode === 201) {
          resolve({
            upload: true,
            location: res.headers.location,
            before: data.length
          });
        } else {
          reject({
            upload: false,
            statusCode: res.statusCode
          })
        }
      });
      req.write(data);
      req.end();
      req.on("error", (err: any) => {
        reject({
          upload: false,
          statusCode: 10000
        });
      });
    }, uploadDelay);
  });
};
export default upload;
