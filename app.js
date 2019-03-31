const path = require('path');

const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const serve = require('koa-static');
const jwtKoa = require('koa-jwt')

const secret = 'Yomi'

const Router = require('./src/router');
const config = require('./src/config');

const main = serve(path.join(__dirname, 'public'));
const app = new Koa();


app.use(cors())
app.use(main);
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 20 * 1024 * 1024 // 设置上传文件大小最大限制
  }
}));

// 封装console
let customizeFn = {
  error (str) {
    console.log("\033[31m " + str + " \033[0m")
  },
  info (str) {
    console.log("\033[36m " + str+ " \033[0m")
  },
  wran (str) {
    console.log("\033[43;37m " + str + " \033[0m")
  },
  success (str) {
    console.log("\033[32m " + str + " \033[0m")
  }
}

console = Object.assign(console, customizeFn)


// token
app.use(jwtKoa({secret}).unless({
  path: [
    /^\/api\/.+\/t0\/*/,
    '/api/user/WXlogin'
  ] //数组中的路径不需要通过jwt验证
}));



// logger
app.use(async (ctx, next) => {
  await next();
  const body = ctx.request.body
  const query = ctx.query
  const rt = ctx.response.get('X-Response-Time')
  console.log(`${ctx.method} ${ctx.url} - ${rt} body ${JSON.stringify(body)} query ${JSON.stringify(query)}`)
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});


app.use(Router.routes());

// console.log(Router)
app.listen(config.APP_PORT, () => console.log(`running http://${(function () {
  let interfaces = require('os').networkInterfaces();
  for (let devName in interfaces) {
    let iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
})()}:${config.APP_PORT}`));
