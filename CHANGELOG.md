### 2019.06.28

### Add

1. 输入`--version`打印版本号
2. 输入参数进行严格校验，并进行适当的提示

### 2019.06.25

### Add

1. 输入`--help`打印命令参数提示
2. 打印压缩详情

#### Fixes

1. 增加请求借口的间隔时间，减少接口返回429的可能
2. 如果当前目录下无图片，退出进程

### 2019.06.24

### Add
1. 增加压缩单张图片的方法

#### Fixes

1. 增加请求最大链接数限制，修复上传过多图片导致接口报错的问题
2. 修复上传文件报错无法被捕获的问题