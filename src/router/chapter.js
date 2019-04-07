const Router = require('koa-router');
const chapterDao = require("../db/chapter")

let chapter = new Router({
  prefix: '/api/chapter'
});

chapter.get('/', async (ctx, next) => {
  const {chapterId} = ctx.query
  if (!chapterId) {
    return ctx.body = {
      status: 400,
      message: 'params is not present',
      data: null
    }
  } else {
    const chapter =  await chapterDao.findChapterById(chapterId)
    if (chapter)
      return ctx.body = {
        status: 200,
        message: 'success',
        data: await chapterDao.findChapterById(chapterId)
      }
    else return ctx.body = {
      status: 404,
      message: 'no such chapter',
      data: null
    }
  }

})

chapter.get('/t0/list', async (ctx, next) => {
  const {bookId, pageNo, pageSize} = ctx.query
  if (!bookId || !pageNo || !pageSize) {
    return ctx.body = {
      status: 400,
      message: 'params is not present',
      data: null
    }
  } else {
    return ctx.body = {
      status: 200,
      message: 'success',
      data: await chapterDao.findChaptersByBookId(bookId, ~~pageNo, ~~pageSize)
    }
  }
});


module.exports = chapter;
