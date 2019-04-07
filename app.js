const path = require('path');

const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const serve = require('koa-static');
const jwtKoa = require('koa-jwt')
const jwt = require('jsonwebtoken')
const verify = require('util').promisify(jwt.verify) // 解密

const Router = require('./src/router');
const Router2b = require('./src/router2b');
const config = require('./src/config');
const Socket = require('./src/utils/socket')

const main = serve(path.join(__dirname, 'src', 'public'));
const app = new Koa();
const server = require('http').createServer(app.callback());


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

// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use(function(ctx, next){
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = {
        status: 401,
        data: null,
        message: 'token失效请重新登陆'
      };
    } else {
      throw err;
    }
  });
});

// token
app.use(jwtKoa(
  {
    debug: true,
    secret: config.SECRET
  }).unless({
  path: [
    /^\/api\/.*/,
    /^\/api\/.+\/t0\/*/,
    '/api/user/WXlogin',
    /.+\.[html|ico|jpg)]/,
    /^\/api2b\/*/
  ] //数组中的路径不需要通过jwt验证
}));


// logger
app.use(async (ctx, next) => {
  await next();
  console.log(ctx.user)
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

app.use(cors())
app.use(main);
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 20 * 1024 * 1024 // 设置上传文件大小最大限制
  }
}));
app.use(Router.routes());
app.use(Router2b.routes())

global.socket = new Socket(server, ['book'])

// console.log(Router)
server.listen(config.APP_PORT, () => console.log(`running http://${(function () {
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
