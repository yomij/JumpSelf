const Router = require('koa-router');
const request = require('request');
const jwt = require('jsonwebtoken')
const verify = require('util').promisify(jwt.verify) // 解密
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

verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6IuaKim_miZPmiJBP55qEWTBtaSIsIm9wZW5JZCI6Im9pV1hUNVBXYlhwM2N2MS1wZDBkYmJ4ODJxZXMiLCJwaG9uZSI6IiIsImlhdCI6MTU1Mzk0NjcwMywiZXhwIjoxNTU0MDMzMTAzfQ.2ll5GfF-SK7GHMa9Y7tWfthIEKn8ofvdYPjnIGnmBeg', config.SECRET)
// 获取照片列表
user.post('/WXlogin', async (ctx, next) => {

  const body = ctx.request.body

  console.log(ctx.header)
 
  if (!body.code) {
    ctx.body = {
      status: 400,
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
      ctx.body = {
        status: 400,
        message: body.code
      }
    }

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
