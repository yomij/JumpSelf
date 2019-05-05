const Router = require('koa-router');
const userDao = require("../db/user")
const behaviorDao = require("../db/behavior")
const bookDao = require("../db/book")

let user = new Router({
	prefix: '/api/subscription'
});


// 订阅
user.post('/', async (ctx, next) => {
	const {bookId} = ctx.request.body
	if (!bookId) {
		return ctx.body = {
			status: '400',
			data: null,
			message: 'params are not present'
		}
	}
	const user = ctx.state.user
	const id = user.id
	console.log(bookId, id)
	try {
		const behavior = await behaviorDao.addSub(bookId, id) // 添加用户行为数据
		await bookDao.addSubscription(bookId, Date.now()) // 添加用户行为数据
		await userDao.server.addSub(id, bookId, behavior._id)
	} catch(e) {
		return ctx.body = {
			status: 500,
			message: e.message,
			data: null,
		}
	}
	ctx.body = {
		status: 200,
		message: 'subscription succsess',
		data: true
	}
})

// 取消订阅
user.delete('/', async (ctx, next) => {
	const {bookId} = ctx.request.body
	if (!bookId) {
		return ctx.body = {
			status: '400',
			data: null,
			message: 'params are not present'
		}
	}
	const user = ctx.state.user
	const id = user.id
	console.log(bookId, id)
	try {
		await userDao.server.unSub(id, bookId)
	} catch (e) {
		ctx.body = {
			status: 500,
			message: e.message,
			data: null,
		}
	}
	ctx.body = {
		status: 200,
		message: 'unsubscription success',
		data: true,
	}
})

// 最后阅读
user.post('/lastread', async (ctx, next) => {
	const {bookId, chapterId, title} = ctx.request.body
	if (!bookId || !chapterId || !title) {
		return ctx.body = {
			status: '400',
			data: null,
			message: 'params are not present'
		}
	}
	const res = await userDao.server.lastRead(ctx.state.user.id, bookId, chapterId,title)
	if (res) {
		ctx.body = {
			status: 200,
			message: 'success',
			data: true
		}
	} else {
		ctx.body = {
			status: 500,
			message: 'failed',
			data: null
		}
	}
})

// 顶置
user.post('/overhead', async (ctx, next) => {
	const {bookId} = ctx.request.body
	if (!bookId) {
		return ctx.body = {
			status: '400',
			data: null,
			message: 'params are not present'
		}
	}
	const user = ctx.state.user
	const id = user.id
	let res = null
	try {
		res = await userDao.server.overhead(id, bookId, 1)
	} catch(e) {
		return 	ctx.body = {
			status: 500,
			message: e.message,
			data: null,
		}
	}
	ctx.body = {
		status: 200,
		message: res ? 'overload success' : 'overload failed',
		data: res
	}
})

// 取消
user.post('/unoverhead', async (ctx, next) => {
	const {bookId} = ctx.request.body
	if (!bookId) {
		return ctx.body = {
			status: '400',
			data: null,
			message: 'params are not present'
		}
	}
	const user = ctx.state.user
	const id = user.id
	let res = null
	try {
		res = await userDao.server.overhead(id, bookId, 0)
	} catch(e) {
		return 	ctx.body = {
			status: 500,
			message: e.message,
			data: null,
		}
	}
	ctx.body = {
		status: 200,
		message: res ? 'unoverload success' : 'unoverload failed',
		data: res
	}
})


module.exports = user;
