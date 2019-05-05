const reserve = require('./reserve')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
const bookDao = require('../db/book')
const chapterDao = require('../db/chapter')
const color = require('../utils/getMainColor')

const superagent = require('superagent')
require('superagent-charset')(superagent)
require('superagent-proxy')(superagent)
const async = require('async');
const spiderConfig = {
  CONCURRENCY_COUNT: 10,
  MAX_SINGLE_COUNT: 100
}



async function spider(book, clist) {
  if (typeof book === 'string') {
    let bookInfo
    try {
      bookInfo = await reserve.getBook(book)
    } catch (e) {
      console.log(e.message)
      return spider(book, clist)
    }
    book = await bookDao.server.insert(bookInfo)
    // console.log(book)
    book.chapterUrl = bookInfo.chapterUrl
    // console.log(book, book.mainImg)

    // console.log(await color(book.mainImg))
  }
  // console.log(await color(book.mainImg))
  const cs = clist ? clist : await reserve.getChapters(book.chapterUrl)
  console.log(cs)
  let list = []
  while (cs.length) {
    list.push(cs.splice(0, spiderConfig.MAX_SINGLE_COUNT))
  }
  let index = 0
  async.mapLimit(list, 1, function (subList, callback) {
    dos(subList, index++, book._id, callback)
  }, function (err, result) {
    const failed = []
    result.forEach(item => {
      failed.push(...item.data.failed)
    })
    return {
      failCount: failed.length,
      failed
    }
  })
}

function dos(list, index, bookId, subCallback) {
  async.mapLimit(list, spiderConfig.CONCURRENCY_COUNT, function (cs, callback) {
    cs = Object.assign(cs, {
      bookId,
      _id: bookId + cs.chapterNum
    })
    reserve.getChapter(cs.source).then(res => {
      console.log(cs.source)
      cs.content = res
      cs.success = true
      global.socket.book(`章节编号:${cs.chapterNum} ${cs.title} 抓取成功<br/>`)
      callback(null, cs)
    }).catch(e => {
      cs.success = false
      cs.content = ''
      global.socket.book(`章节编号:${cs.chapterNum} ${cs.title} 抓取失败，失败理由：${e.message}<br/>`)
      callback(null, cs)
    })

  }, function (err, result) {
    let failed = []
    const success = result.filter(item => {
      if (!item.success) failed.push(item)
      return item.success
    })
    // 写入数据库
    chapterDao.insertChapters(result)
    if (!err) {
      subCallback(null, {
        index,
        success: true,
        data: {
          failed,
          success
        }
      })
    } else {
      subCallback(null, {
        index,
        success: false,
        data: {
          failed: list,
          success: []
        }
      })
    }
    global.socket.book(`第${index + 1} 轮抓取结束<br/>`)
  });
}

async function search (text) {
  return await reserve.search(text)
}

async function getChapter(source) {
  if (Math.random() > 0.5) {
    return await reserve.getChapter(source)
  } else {
    const arr = source.split('/')
    const cn = 	arr.pop().match(/\d+/g)[0]
    const id = arr.pop()
    return await reserve.getChapterM(id, cn)
  }
}

module.exports = {
  spider,
  search,
  getChapter
}

