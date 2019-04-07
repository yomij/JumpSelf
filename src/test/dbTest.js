const commentDao = require('../db/comment')
const userDao = require('../db/user')
const chapterDao = require('../db/chapter')
// commentDao.insertComment({
//   bookId: '5ca8a3d40e23761aa0bfe49f',
//   chapterId:  '5ca8a3d40e23761aa0bfe49f0',
//   userId: '5c9f584f81a4b6449c52ad14',
//   content: '难受',
//   createTime: Date.now(),
// })

async function test() {
  // console.log(await commentDao.findByChapter('5ca8a3d40e23761aa0bfe49f0'))
  // console.log(await chapterDao.findChaptersByBookId('5ca8a3d40e23761aa0bfe49f', 1, 10))
   console.log(await chapterDao.findChapterById("5ca8a3d40e23761aa0bfe49f0"))
}

test()