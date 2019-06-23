import { uploadConfig, headersConfig } from "./config";
import { IncomingMessage } from "http";
const https = require("https");
const fs = require("fs");

interface PromiseValue {
  upload: boolean;
  location?: string;
}
// 上传图片
const upload = (filePath: string, ext: string): Promise<PromiseValue> => {
  return new Promise((resolve, reject) => {
    const config = Object.assign({}, uploadConfig);
    const headers = Object.assign({}, headersConfig);
    headers["content-type"] = `image/${ext}`;
    config.headers = headers;
    const req = https.request(config, (res: IncomingMessage) => {
      // 图片上传成功
      if (res.statusCode === 201) {
        resolve({
          upload: true,
          location: res.headers.location
        });
      } else {
        reject({
          upload: false
        })
      }
    });
    const data = fs.readFileSync(filePath);
    req.write(data);
    req.end();
    req.on("error", (err: any) => {
      reject({
        upload: false
      });
    });
  });
};
export default upload;
