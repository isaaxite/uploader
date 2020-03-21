const fs = require('fs');
const Koa = require('koa2');
const path = require('path');
const koaStatic = require('koa-static')
const koaBody = require('koa-body'); //解析上传文件的插件
const router = require('koa-router')();

const app = new Koa();
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 2000 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
  }
}));

app.use(koaStatic(
  path.join(__dirname, './static')
));

router.post('/api/upload', (ctx) => {
  const file = ctx.request.files.file;
  const staticDir = path.join(__dirname, './static');
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  // 创建可写流
  const upStream = fs.createWriteStream(path.join(staticDir, file.name));
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  return ctx.body = {
    message: "文件上传成功",
    cc: 0
  }   
});
app.use(router.routes());
app.listen(8181);
