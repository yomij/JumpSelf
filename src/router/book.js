const Router = require('koa-router');
const colorx = require("color-thief-node");
const superagent = require('superagent')

const bookDao = require('../db/book')
const behaviorDao = require('../db/behavior')
const recommend = require('../utils/recommend')

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

book.get('/t0', async (ctx, next) => {
	const id = ctx.query.bookId
	if (!id) {
		ctx.body = {
			status: 400,
			message: 'BookId Is Not Present',
			data: null
		}
	} else {
		const user = ctx.state.userToken
		try {
			const book = await bookDao.server.getBookDetail(ctx.query.bookId, user ? user.id : null)

			ctx.body = {
				status: 200,
				message: 'success',
				data: book
			}
		} catch(e) {
			ctx.body = {
				status: 204,
				message: e.message,
				data: null
			}
		}
	}
})

const mainPageDate = {}

book.get('/t0/main', async (ctx, next) => {
	let {tag} = ctx.query

	if (mainPageDate[tag] && Date.now() - mainPageDate[tag].time < 24 * 60 * 60 * 1000) {
		return 	ctx.body = {
			status: 200,
			message: 'success',
			data: mainPageDate[tag].data
		}
	}

	let tags = []
	if (tag == 0) {
		tags = ['侦探推理',  '修真仙侠', '言情穿越', '耽美同人',  '都市青春']
	} else {
		tag = 1
		tags = ['玄幻奇幻', '网游竞技', '科幻奇异', '历史军事', '侦探推理']
	}
	const res = await bookDao.getHeaterByTag(tags, 7)
	let ids = res.map(item => item._id)
	const click = await bookDao.getMostClickDaily(tags, ids, 4)
	click.forEach(item => ids.push(item._id))
	const subscription = await bookDao.getMostSubscriptionDaily(tags, ids, 4)
	const result = {
		hottest: res,
		mostClicked: click,
		mostSubscription: subscription
	}

	mainPageDate[tag] = {
		data: result,
		time: Date.now()
	}
	ctx.body = {
		status: 200,
		message: 'success',
		data: result
	}
})

book.get('/t0/search', async (ctx, next) => {
	const {search, pageSize = 10, pageNo = 1} = ctx.query
	const res = await bookDao.search(search, ~~pageNo, ~~pageSize)
	ctx.body = {
		status: 200,
		message: 'success',
		data: res
	}
})

book.get('/t0/presearch', async (ctx, next) => {
	const {search} = ctx.query
	if (!search) {
		return ctx.body = {
			status: 400,
			message: 'param is not present'
		}
	}
	const result = await bookDao.server.preSearch(search)
	ctx.body = {
		status: 200,
		message: 'success',
		data: result
	}
})

book.get('/recommend', async (ctx, next) => {
	const userId = ctx.state.user.id
	const data = await behaviorDao.server.getRecommendData(userId)
	const result = recommend.getRecommend(data.behavior, data.personalInfo.book[0])
	const books = result.map(item => item.book)

	ctx.body = {
		status: 200,
		data: {
			books: await bookDao.server.getBookByIds(books, userId),
			recommend: result
		},
		message: 'success'
	}
})

module.exports = book;
