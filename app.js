const path = require('path');

const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const serve = require('koa-static');
const jwtKoa = require('koa-jwt')
let fs = require("fs");

const Router = require('./src/router');
const Router2b = require('./src/router2b');
const config = require('./src/config');
const Socket = require('./src/utils/socket')

require('./src/utils/console')

const main = serve(path.join(__dirname, 'src', 'public'));
const app = new Koa();


const server = require('http').createServer(app.callback());
const serverHttps = require('https').createServer({
  key : fs.readFileSync("./https/2030487_www.yomij.cn.key"),
  cert: fs.readFileSync("./https/2030487_www.yomij.cn.pem")
}, app.callback())

// 跨域配置
app.use(cors())
// 静态文件
app.use(main);
// 上传限制
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 20 * 1024 * 1024 // 设置上传文件大小最大限制
  }
}));


// Custom 401 handling
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
    secret: config.SECRET,
    // getToken(ctx, opts) {
    //   if (!ctx.header || !ctx.header.authorization) {
    //     return;
    //   }
    //   const parts = ctx.header.authorization.split(' ');
    //   console.log(parts)
    //   if (parts.length === 2) {
    //     const scheme = parts[0];
    //     const credentials = parts[1];
    //     if (/^Bearer$/i.test(scheme)) {
    //       return credentials;
    //     }
    //   }
    //   if (!opts.passthrough) {
    //     ctx.throw(401, 'Bad Authorization header format. Format is "Authorization: Bearer <token>"');
    //   }
    // }
  }).unless({
  path: [
    // /^\/api\/.*/,
    /^\/api\/.+\/t0\/*/,
    '/api/user/WXlogin',
    /.+\.[html|ico|jpg)]/,
    /^\/api2b\/*/
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

serverHttps.listen(config.HTTPS_PORT, () => console.log(`running http://${(function () {
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
})()}:${config.HTTPS_PORT}`))
