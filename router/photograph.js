const Router = require('koa-router');
const color = require("color-thief-node");

let book = new Router({
	prefix: '/api/book'
});

book.get('/color', async (ctx, next) => {
	const item = await color.getColorFromURL('http://img0.imgtn.bdimg.com/it/u=3694249603,3939975669&fm=26&gp=0.jpg')
	// thmclrx.octree('http://pic1.win4000.com/mobile/2018-12-10/5c0e13e2e923a.jpg', (res) => console.log(res));
ctx.body = {
	colors:`rgb(${item[0]},${item[1]},${item[2]})`
}

})


module.exports = book;
