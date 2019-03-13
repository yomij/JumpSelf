const path = require('path');

const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const serve = require('koa-static');
const Router = require('./router');
const config = require('./src/config');

const main = serve(path.join(__dirname, 'public'));
const app = new Koa();

app.use(koaBody({
	multipart: true,
	formidable: {
		maxFileSize: 20 * 1024 * 1024 // 设置上传文件大小最大限制
	}
}));

// logger
app.use(async (ctx, next) => {
	await next();
	const rt = ctx.response.get('X-Response-Time');
	console.log(`${ctx.method} ${ctx.url} - ${rt}`);
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
app.use(Router.routes());
// console.log(Router)
app.listen(config.APP_PORT, () => console.log(`running http://localhost:${config.APP_PORT}`));
