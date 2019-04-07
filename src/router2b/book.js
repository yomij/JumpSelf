const Router = require('koa-router');
const novel = require('../novel')

let book = new Router({
  prefix: '/api2b/book'
});


book.get('/add', async (ctx, next) => {
  const url = ctx.query.url
  novel.spider(url)
  ctx.body = '抓取开始'
})


module.exports = book;