const Router = require('koa-router');
const colorx = require("color-thief-node");
const superagent = require('superagent')

let book = new Router({
	prefix: '/api/book'
});

let bufferImg =  null

book.get('/t0/color', async (ctx, next) => {
	const img = 'http://img.yomij.cn/1124176533d0e0e9e4o.jpg'
	if (!bufferImg)
		bufferImg = await superagent.get(img)
	const items = await colorx.getPaletteFromURL(bufferImg.body)
	// thmclrx.octree('http://pic1.win4000.com/mobile/2018-12-10/5c0e13e2e923a.jpg', (res) => console.log(res));
	let color = [0, 0, 0]
	items.forEach((item, index) => {
		const a = [.7 , .1, .1, .05, .05]
		color[0] += ~~(item[0] * a[index])
		color[1] += ~~(item[1] * a[index])
		color[2] += ~~(item[2] * a[index])
	})
	console.log(items, color)
	ctx.body = {
		// colors
		mainImg: img,
		colors: [
			`rgba(${color[0]}, ${color[1]}, ${color[2]}, .5)`,
			`rgba(${color[0]}, ${color[1]}, ${color[2]}, .8)`,
			`rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`
		],
		allColor: items
	}
})


module.exports = book;
