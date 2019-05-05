const Router = require('koa-router');
const chapterDao = require("../db/chapter")
const novel = require('../novel')

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
    if (chapter && chapter.content) {
      return ctx.body = {
        status: 200,
        message: 'success',
        data: chapter
      }
    } else if (chapter && !chapter.content) {
      try {
        const content = await novel.getChapter(chapter.source)
        const doc = await chapterDao.updateChapter(chapterId, content)
        chapter.content = content
      } catch(e) {
        if (e) {
          return ctx.body = {
            status: 500,
            message: e.message,
            data: null
          }
        }
      }
      return ctx.body = {
        status: 200,
        message: 'success',
        data: chapter
      }
    } else {
      return ctx.body = {
        status: 404,
        message: 'no such chapter',
        data: null
      }
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

chapter.get('/t0/list/more', async (ctx, next) => {
  const {bookId, num, size} = ctx.query
  if (!bookId || !num || !size) {
    return ctx.body = {
      status: 400,
      message: 'params is not present',
      data: null
    }
  } else {
    return ctx.body = {
      status: 200,
      message: 'success',
      data: await chapterDao.findChaptersMore(bookId, ~~num, ~~size)
    }
  }
});

module.exports = chapter;
