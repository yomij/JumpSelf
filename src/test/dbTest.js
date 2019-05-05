// const commentDao = require('../db/comment')
const userDao = require('../db/user')
const chapterDao = require('../db/chapter')
const bookDao = require('../db/book')
const behaviorDao = require('../db/behavior')

const commentDao = require('../db/comment')
// commentDao.insertComment({
//   bookId: '5ca8a3d40e23761aa0bfe49f',
//   chapterId:  '5ca8a3d40e23761aa0bfe49f0',
//   userId: '5c9f584f81a4b6449c52ad14',
//   content: '难受',
//   createTime: Date.now(),
// })

async function test(dao, func) {
  // console.log(await commentDao.findByChapter('5ca8a3d40e23761aa0bfe49f0'))
  // console.log(await chapterDao.findChaptersByBookId('5ca8a3d40e23761aa0bfe49f', 1, 10))
  //  console.log(await chapterDao.findChapterById("5ca8a3d40e23761aa0bfe49f0"))
  // const res = await userDao.overhead('5c9f584f81a4b6449c52ad14', '5cb56b203ad6d3106022bf97', 1)
  //  const res = await userDao.server.addSub('5c9f584f81a4b6449c52ad14', '5cb56b203ad6d3106022bf97')

  // 获取最热书籍
  // const res = await bookDao.getHeaterByTag(['玄幻奇幻', '科幻灵异'], 3)

  // const res = await  bookDao.search('天蚕土豆')
  // const res = await commentDao.addComment('5cb9a9b35349443d303530b8', '5cb9a9b35349443d303530b80', '5c9f584f81a4b6449c52ad14', '吼吼吼略略略号都爱是啊谁都不会u啊是不低啊时代uahb嗲是不iuas比赛巴斯u不阿斯u的不爱上不i')
  // const res = await  commentDao.getComment('5cb9a9b35349443d303530b80', 1, 10)

  // const res = await bookDao.server.preSearch('东')
  // const res = await chapterDao.findChaptersMore('5cb9dcce7c0eb039dc954ac5', 3, 3)
  // const res = await commentDao.like('5cc1b5b7700449333c88bd32', '5c9f584f81a4b6449c52ad14')

  // const data = {
  //   "5cb9a9bd5349443d303530ba": {"1": {"count": 3, "extara": null}, "4": {"count": 3, "extra": null}, "lastUpdate": 1556547368829,},
  //   "5cbf2a5e67245d36b02bc6c8": {"2": {"count": 1, "extra": null}, "3": {"count": 37733, "extara": null}},
  //   "5cb9dcce7c0eb039dc954ac5": {"1": {"count": 2, "extra": null}}
  // }
  //
  // const ks = ['clickCount', 'readCount', 'totalReadTime', 'shareCount']
  // const res = []
  // const books = []
  // for(let key in data) {
  //   books.push(key)
  //   const k = Object.keys(data[key])
  //   const temp = {}
  //   k.forEach(item => {
  //     item === 'lastUpdate' ? temp['lastUpdateTime'] =  data[key][item] : temp[ks[item - 1]] = data[key][item].count
  //   })
  //   res.push(temp)
  // }
  const res =await behaviorDao.totalRead('5cc477282b8c663720c50433')
console.log(res)

  // console.log(books)
}

async function getRecommendData() {
  let res = await behaviorDao.model.aggregate([
    {
      $project: {
        _id: 1,
        book: 1,
        user: 1,
        clickCount: 1,
        everSub: true,
        grade: 1,
        lastUpdateTime: 1,
        readCount: 1,
        shareCount: 1,
        // gradex: [ "$grade", "$readCount", '$shareCount' ]
        gradex: {$add: [{$multiply: ["$grade", 100]}, {$multiply: ["$readCount", 1]}, {$multiply: ["$shareCount", 10]}]}
      }
    },
    {$match: {user: {$ne: require('mongoose').Types.ObjectId('5cc477282b8c663720c50433')}}},
    {$group: {_id: '$book', user: {$addToSet: '$user'}, gradex: {$addToSet: '$gradex'}}},

  ])
  res = res.map(item => {
    const temp = {}
    item.user.forEach((u, i) => {
      temp[u] = item.gradex[i]
    })
    return {
      [item._id]: temp
    }
  })

  let personal = await behaviorDao.model.aggregate([
    {
      $project: {
        _id: 1,
        book: 1,
        user: 1,
        clickCount: 1,
        everSub: true,
        grade: 1,
        lastUpdateTime: 1,
        readCount: 1,
        shareCount: 1,
        // gradex: [ "$grade", "$readCount", '$shareCount' ]
        gradex: {$add: [{$multiply: ["$grade", 100]}, {$multiply: ["$readCount", 1]}, {$multiply: ["$shareCount", 10]}]}
      }
    },
    {$match: {user: {$eq: require('mongoose').Types.ObjectId('5cc477282b8c663720c50433')}}},
    {$sort: {gradex: 1}},
    {$group: {_id: '$user', book: {$addToSet: '$book'}, gradex: {$addToSet: '$gradex'}}},

  ])
  return {
    behavior: res,
    personalInfo: personal
  }
}

test()