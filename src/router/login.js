const Router = require('koa-router');
const request = require('request');
const jwt = require('jsonwebtoken')
const crypto = require('crypto');

const file = require("../utils/file")
const emilSender = require("../utils/sendEmail")
const config = require("../config")


const userDao = require("../db/user")


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

const setMessage = function (phone) {
  console.error(phone)
  return new Promise((resolve, reject) => {
    request({
      url: 'https://api.bmob.cn/1/requestSmsCode',
      method: 'POST',
      json: true,
      headers: {
        'X-Bmob-Application-Id': 'f81adf6c9c76c10f54a0b355f1f81434',
        'X-Bmob-REST-API-Key': '1ea74ee0a44f92dde0bcb22e4ab9537b',
        'content-Type': 'application/json'
      },
      body: {
        "mobilePhoneNumber": phone,
        "template": 'Yomi',
      }
    }, (error, response, body) => {
      if(!error && response.statusCode == 200) resolve(body)
      else reject(error)
    })
  })
}

const verifyMessage = function (phone, code) {
  return new Promise((resolve, reject) => {
    request({
      url: 'https://api.bmob.cn/1/verifySmsCode/' + code,
      method: 'POST',
      json: true,
      headers: {
        'X-Bmob-Application-Id': 'f81adf6c9c76c10f54a0b355f1f81434',
        'X-Bmob-REST-API-Key': '1ea74ee0a44f92dde0bcb22e4ab9537b',
        'content-Type': 'application/json'
      },
      body: {
        "mobilePhoneNumber": phone,
      }
    }, (error, response, body) => {
      console.log(response)
      console.error(JSON.stringify(body))
      if(!error && response.statusCode == 200) {
        const res =  body
        console.log(res)
        if (res.msg === 'ok') resolve('ok')
        else {
          console.log(res)
          throw new Error(res.error)
        }
      } else {
        let res = null
        if (body)  res = body
        reject(error || new Error(res ? '验证失败' : response.statusCode))
      }
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
      console.info(JSON.stringify(userInfo))
      const token = jwt.sign({
        id: userInfo._id,
        nickname: userInfo.nickname,
        openId: userInfo.openId,
        phone: userInfo.phone || '',
        avatarUrl: body.userInfo.avatarUrl,
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
      console.log(userInfo)
      const token = jwt.sign({
        id: userInfo._id,
        nickname: userInfo.nickname,
        openId: userInfo.openId,
        phone: userInfo.phone || '',
        avatarUrl: userInfo.avatarUrl,
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
  const {phone, password} = ctx.request.body
  if (!phone || !password) {
    ctx.body = {
      status: 400,
      data: null,
      message: 'code is not present'
    }
  } else {

    const user = await userDao.queryUserByPhone(phone)
    if (!user.length) {
      ctx.body = {
        status: 404,
        message: 'phone is not exist',
        data: null
      }
    } else {
      const userInfo = user[0]
      const md5 = crypto.createHash('md5');
      md5.update(password)
      if (userInfo.password === md5.digest('hex')) {
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
        ctx.body = {
          status: -1,
          message: 'password mistake',
          data: null
        }
      }
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


// 发送验证码
user.post('/verifycode', async (ctx, next) => {
  const body = ctx.request.body
  if (!body.phone) {
    ctx.body = {
      status: 400,
      data: null,
      message: 'phone is not present'
    }
  } else {
    try {
      await setMessage(body.phone)
    } catch (e) {
      return ctx.body = {
        status: 500,
        message: e.message,
        data: null
      }
    }
    ctx.body = {
      status: 200,
      message: 'msg send succsss',
      data: true
    }
  }
})


user.post('/verify', async (ctx, next) => {
  let {phone , code, password} = ctx.request.body
  const user = ctx.state.user
  if (!phone || !code || !password) {
    ctx.body = {
      status: 400,
      data: null,
      message: 'params is not present'
    }
  } else {
    try {
      const res = await verifyMessage(phone, code)
      if (res === 'ok') {
        const md5 = crypto.createHash('md5');
        md5.update(password);
        password = md5.digest('hex');
        await userDao.server.updatePhone(user.id, phone, password)
      }
    } catch (e) {
      return ctx.body = {
        status: 500,
        message: e ? e.message : 'failed',
        data: null
      }
    }
    ctx.body = {
      status: 200,
      message: 'verify succsss',
      data: true
    }
  }
})

let problems = []
// 取消
user.post('/problem', async (ctx, next) => {

  const {problem} = ctx.request.body
  if (!problem) {
    return ctx.body = {
      status: '400',
      data: null,
      message: 'params are not present'
    }
  }
  const user = ctx.state.user
  const id = user.id
  problems.push({
    id: user.id,
    avatarUrl: user.avatarUrl,
    nickname: user.nickname,
    problem
  })
  if (problem.length >= config.PROBLEM_SEND_COUNT) {
    await emilSender('Yomi 问题反馈', problems)
    await file.writeJson(problems, 'Problem ' + new Date().toString())
  }
  ctx.body = {
    status: 200,
    message: 'success',
    data: true
  }
})

// 取消
user.get('/t0/problem', async (ctx, next) => {

  const {problem} = ctx.request.query
  if (!problem) {
    return ctx.body = {
      status: '400',
      data: null,
      message: 'params are not present'
    }
  }
  const user = ctx.state.userToken
  const id = user.id
  problems.push({
    id: user.id,
    avatarUrl: user.avatarUrl,
    nickname: user.nickname,
    problem
  })
  if (problem.length >= config.PROBLEM_SEND_COUNT) {
    await emilSender('Yomi 问题反馈', problems)
    await file.writeJson(problems, 'Problem ' + new Date().toLocaleDateString())
  }
  ctx.body = {
    status: 200,
    message: 'success',
    data: true
  }
})

module.exports = user;
