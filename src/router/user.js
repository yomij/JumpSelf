const Router = require('koa-router');
const request = require('request');
const jwt = require('jsonwebtoken')
const userDao = require("../db/user")

const config = require('../config')


let user = new Router({
	prefix: '/api'
});


// 订阅
user.post('/book/subscription', async (ctx, next) => {
	const user = ctx.state.user
	ctx.body = {}
})

// 更新订阅


// 取消订阅



module.exports = user;
