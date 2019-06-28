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

export function printHelp() {
  console.log(`tinypngs                                 \u001b[1m\u001b[31m压缩当前目录下所有图片,输入目录为当前目录\u001b[0m`);
  console.log(`tinypngs --outdir test                   \u001b[1m\u001b[31m压缩当前目录下所有图片,输入目录为test\u001b[0m`);
  console.log(`tinypngs --single test.png               \u001b[1m\u001b[31m压缩当前目录下test.png图片,输出目录为当前目录\u001b[0m`);
  console.log(`tinypngs --outdir dist --single test.png \u001b[1m\u001b[31m压缩当前目录下test.png图片,输出目录为dist目录\u001b[0m`);
}
