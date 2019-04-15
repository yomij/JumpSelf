const Router = require('koa-router');
const request = require('request');
const jwt = require('jsonwebtoken')
const userDao = require("../db/user")

const config = require('../config')


let user = new Router({
  prefix: '/api/user'
});

const jscode2session = function (code) {
  return new Promise((resolve, reject) => {
    request(`https://api.weixin.qq.com/sns/jscode2session?appid=${config.WXConfig.APP_ID}&secret=${config.WXConfig.APP_SECRET}&js_code=${code}&grant_type=authorization_code`, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body))
      }
      reject('jscode2session failed')
    })
  })
}

// 微信登陆
user.post('/WXlogin', async (ctx, next) => {
  const body = ctx.request.body
  if (!body.code) {
    ctx.body = {
      status: 400,
      data: null,
      message: 'code is not present'
    }
  } else {
    const res = await jscode2session(body.code)
    const user = await userDao.queryUserByOpenId(res.openid)
    if (!user.length) {
      const userInfo = await userDao.insertUser({
        openId: res.openid,
        nickname: body.userInfo.nickName,
        avatarUrl: body.userInfo.avatarUrl,
      })
      console.info( JSON.stringify(userInfo))
      const token = jwt.sign({
        id: userInfo._id,
        nickname: userInfo.nickname,
        openId: userInfo.openId,
        phone: userInfo.phone || ''
      }, config.SECRET, { expiresIn: '24h' });
      ctx.body = {
        status: 200,
        message: 'success',
        data: {
          token
        }
      }
    } else {
      const userInfo = user[0]
      const token = jwt.sign({
        id: userInfo._id,
        nickname: userInfo.nickname,
        openId: userInfo.openId,
        phone: userInfo.phone || ''
      }, config.SECRET, { expiresIn: '24h' });
      ctx.body = {
        status: 200,
        message: 'success',
        data: {
          token
        }
      }
    }
  }
})

// 账号登陆
user.post('/login', async (ctx) => {
  const data = ctx.request.body;
  if(!data.username || !data.password){
    return ctx.body = {
      status: '400',
      data: null,
      message: 'params are not present'
    }
  }
  const flag = data.flag
  const userInfo = await userDao.queryUserByPhone(data.username)
  if(userInfo !== null){
    const token = jwt.sign({
      id: userInfo._id,
      nickname: userInfo.nickname,
      openId: userInfo.openId,
      phone: userInfo.username
    }, config.SECRET, { expiresIn: '24h' });
    return ctx.body = {
      status: 200,
      data: {
        token
      },
      message: 'success'
    }
  }else{
    return ctx.body = {
      status: -1,
      data: null,
      message: '用户名或密码错误'
    }
  }
});

user.get('/', async (ctx) => {
  const user = ctx.state.user
  console.log(ctx.state.user, ctx.state.jwtdata)
  const userInfo = await userDao.queryUserById(user.id)
  ctx.body = {
    status: 200,
    data: userInfo,
    message: 'success'
  }
});


module.exports = user;
