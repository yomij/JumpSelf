const Router = require('koa-router');
const commentDao = require("../db/comment")

let comment = new Router({
  prefix: '/api/comment'
});


comment.get('/t0/chapter', async (ctx, next) => {
  const {chapterId, pageSize = 10, pageNo = 1, type = 0} = ctx.query // type 0 点赞数 1 时间
  const userId = ctx.state.userToken ? ctx.state.userToken.id : null

  console.error(userId)
  if (!chapterId) {
    return ctx.body = {
      status: 400,
      message: 'params is not present',
      data: null
    }
  } else {
    const data = ~~type === 1 ? await commentDao.getComment(chapterId, ~~pageNo, ~~pageSize, userId) : await commentDao.getCommentByLike(chapterId, ~~pageNo, ~~pageSize, userId)
    return ctx.body = {
      status: 200,
      message: 'success',
      data
    }
  }
})

comment.post('/chapter', async (ctx, next) => {
  const {bookId, chapterId, content} = ctx.request.body // type 0 点赞数 1 时间
  console.info(bookId, chapterId, content)
  if (!chapterId || !content || !bookId) {
    return ctx.body = {
      status: 400,
      message: 'params is not present',
      data: null
    }
  } else {
    // bookId, chapterId, userId, content
    const data = await commentDao.addComment(bookId, chapterId, ctx.state.user.id, content)
    return ctx.body = {
      status: 200,
      message: 'success',
      data
    }
  }
})

comment.post('/like', async (ctx, next) => {
  const {id} = ctx.request.body
  if (!id) {
    return ctx.body = {
      status: 400,
      message: 'params is not present',
      data: null
    }
  } else {
    // bookId, chapterId, userId, content
    const data = await commentDao.like(id, ctx.state.user.id)
    return ctx.body = {
      status: 200,
      message: 'success',
      data
    }
  }
})

comment.post('/unlike', async (ctx, next) => {
  const {id} = ctx.request.body
  if (!id) {
    return ctx.body = {
      status: 400,
      message: 'params is not present',
      data: null
    }
  } else {
    // bookId, chapterId, userId, content
    const data = await commentDao.unlike(id, ctx.state.user.id)
    return ctx.body = {
      status: 200,
      message: 'success',
      data
    }
  }
})

module.exports = comment;
