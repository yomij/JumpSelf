const Router = require('koa-router');
const behaviorDao = require("../db/behavior")
const bookDao= require("../db/book")

let behavior = new Router({
  prefix: '/api/behavior'
});


// 评分
behavior.post('/grade', async (ctx, next) => {
  const {bookId, grade} = ctx.request.body
  if (!bookId || ~~grade <= 1) {
    return ctx.body = {
      status: '400',
      data: null,
      message: 'params are not present'
    }
  }
  const user = ctx.state.user
  const id = user.id
  let behavior = {}
  try {
    behavior = await behaviorDao.grade(bookId, id, ~~grade)
    await bookDao.addGrade(bookId, ~~grade)
  } catch(e) {
    return ctx.body = {
      status: 500,
      message: e.message,
      data: null
    }
  }
  ctx.body = {
    status: 200,
    message: 'grade success',
    data: behavior
  }
})

// 订阅
behavior.post('/sub', async (ctx, next) => {
  const {bookId, grade} = ctx.request.body
  if (!bookId || ~~grade <= 1) {
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
    await behaviorDao.grade(bookId, id, ~~grade)
  } catch(e) {
    return ctx.body = {
      status: 500,
      message: e.message,
      data: null,
    }
  }
  ctx.body = {
    status: 200,
    message: 'grade success',
    data: true
  }
})

// 推荐
behavior.post('/recomment', async (ctx, next) => {
  const {bookId, grade} = ctx.request.body
  if (!bookId || ~~grade <= 1) {
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
    await behaviorDao.grade(bookId, id, ~~grade)
  } catch(e) {
    return ctx.body = {
      status: 500,
      message: e.message,
      data: null,
    }
  }
  ctx.body = {
    status: 200,
    message: 'grade success',
    data: true
  }
})

// 添加
behavior.post('/add', async (ctx, next) => {
  const {bev} = ctx.request.body
  if (!bev) return ctx.body = {status: 400}
  else {
    const data = bev
    const ks = [{key: 'clickCount', v: 1}, {key: 'readCount', v: 1}, {key:'totalReadTime', v: 0}, {key: 'shareCount', v: 10}]
    const res = []
    const books = []
    for(let key in data) {
      books.push(key)
      const k = Object.keys(data[key])
      const temp = {}
      k.forEach(item => {
        if (item === 'lastUpdate') {
          temp['lastUpdateTime'] =  data[key][item]
        } else {
          temp[ks[item - 1].key] = data[key][item].count
          temp['heat'] += data[key][item].count * ks[item - 1].v
        }
      })
      res.push(temp)
    }
    await behaviorDao.server.add(ctx.state.user.id, books, res)
    ctx.body = {status: 200}
  }
})


// 阅读统计
behavior.get('/readInfo', async (ctx, next) => {
  const user = ctx.state.user.id
  const data = await behaviorDao.totalRead(user)
  console.log(data)
  ctx.body = {
    status: 200,
    data: data[0] || {},
    message: 'success'
  }
})

module.exports = behavior;
