const Router = require('koa-router');
const request = require('request');
const jwt = require('jsonwebtoken')
const verify = require('util').promisify(jwt.verify) // 解密

const config = require('../config')


let user = new Router({
  prefix: '/api/user'
});

const jscode2session = function (code) {
  return new Promise((resolve, reject) => {
    request(`https://api.weixin.qq.com/sns/jscode2session?appid=${config.WXConfig.APP_ID}&secret=${config.WXConfig.APP_SECRET}&js_code=${code}&grant_type=authorization_code`, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(body)
      }
      reject('jscode2session failed')
    })
  })
}


// 获取照片列表
user.post('/WXlogin', async (ctx, next) => {

  const body = ctx.request.body
  if (!body.code) {
    ctx.body = {
      status: 400,
      message: 'code is not present'
    }
  } else {
    const res = await jscode2session(body.code)
    console.log(res)
    ctx.body = res.body
    await next()
  }

})



user.post('/login', async (ctx) => {
  const data = ctx.request.body;
  if(!data.name || !data.password){
    return ctx.body = {
      code: '000002',
      data: null,
      msg: '参数不合法'
    }
  }
  const result = await userModel.findOne({
    name: data.name,
    password: data.password
  })
  if(result !== null){
    const token = jwt.sign({
      name: result.name,
      _id: result._id
    }, 'my_token', { expiresIn: '2h' });
    return ctx.body = {
      code: '000001',
      data: token,
      msg: '登录成功'
    }
  }else{
    return ctx.body = {
      code: '000002',
      data: null,
      msg: '用户名或密码错误'
    }
  }
});

module.exports = user;