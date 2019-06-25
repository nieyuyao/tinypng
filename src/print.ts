import { Error, Result } from './config';

export function printError(errors: Error): void {
    let hasError: boolean = false;
    for (const filename in errors) {
      if (!hasError) {
        hasError = true;
      }
      console.log(`\u001b[31m${filename}  ${errors[filename].statusCode}  ${errors[filename].errInfo}\u001b[0m`);
    }
    if (hasError) {
      console.log(`请使用 \u001b[31mtinypngs --single 图片名\u001b[0m 压缩失败的图片`);
    }
}

export function printResult(results: Result): void {
    for (const filename in results) {
      console.log(`\u001b[32m${filename}  ${results[filename].status}  ${results[filename].before} -> ${results[filename].after} ${results[filename].ratio}\u001b[0m`);
    }
}