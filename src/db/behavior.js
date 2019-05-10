const DB = require('../utils/dbConnect')

const db = new DB('yomi', 27017)

const behaviorSchema = db.createSchema({
  book: { type: db.mongoose.Schema.Types.ObjectId, ref: 'book' },
  user:{ type: db.mongoose.Schema.Types.ObjectId, ref: 'user' },
  interest: Number,
  lastUpdateTime: {type: Date, default: Date.now()}, // 最后行为时间 （不包括点击）
  everSub: {default: false, type: Boolean}, // 订阅过
  grade: {default: -1, type: Number}, // 评分
  clickCount: {default: 1, type: Number}, // 点击 次数
  readCount: {default: 1, type: Number}, // 读的次数
  commentCount: {default: 0, type: Number}, // 评论
  likeCount: {default: 0, type: Number}, // 点赞
  totalReadTime: Number, // 阅读时间
  shareCount: {default: 0, type: Number} // 分享次数
})

const behaviorModel = db.connect().model('behavior', behaviorSchema);

// chapterSchema.index({bookId: 1})

const dao = {
  model: behaviorModel,

  // 评分
  async grade(bookId, userId, grade) {
    return await behaviorModel.findOneAndUpdate({
      book: bookId,
      user: userId
    }, {
      grade,
      everSub: true
    }, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    })
  },
  // 添加订阅
  async addSub(bookId, userId) {
    return await behaviorModel.findOneAndUpdate({
      book: bookId,
      user: userId
    }, {
      everSub: true,
      lastUpdateTime: Date.now(),
      $inc:{
        clickCount: 1
      }
    }, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    })
  },
  async totalRead(userId) {
    return await behaviorModel.aggregate([
      {$match: {user: {$eq: require('mongoose').Types.ObjectId(userId)}, totalReadTime: {$gt: 0}}},
      {$group: {_id: '$user', readTime:{ $sum: '$totalReadTime' }, count: { $sum: 1 }}},
    ])
  }

}

const bookDao  = require('./book')

const server = {
  async add (userId, books, data) {
    if(!data.length) return
    for(let i = 0; i< data.length; i++) {
      await behaviorModel.update({
        book: books[i],
        user: userId
      },  data[i], {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      })
      await bookDao.addTotal(books[i], ~~data[i].clickCount , ~~data[i].shareCount, ~~data[i].readCount, ~~data[i].likeCount, ~~ data[i].commentCount)
    }
    return true
  },
  async  getRecommendData(id) {
    let res = await behaviorModel.aggregate([
      {$project: {
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
          gradex: {
            $add: [
              {$multiply: [ "$grade", 100 ]},
              {$multiply: [ "$readCount", 1 ]},
              {$multiply: [ "$shareCount", 10 ]}
            ]}
        }},
      // {$match: {user: {$ne: require('mongoose').Types.ObjectId(id)}}},
      {$group: {_id: '$book', user: {$addToSet: '$user'}, gradex: {$addToSet: '$gradex'}}},

    ])
    const temp = {}
    res.map(item => {
      temp[item._id] = {}
      item.user.forEach((u, i) => {
        temp[item._id][u] = item.gradex[i]
      })
    })

    let personal = await behaviorModel.aggregate([
      {$project: {
          _id: 1,
          book: 1,
          user: 1,
          clickCount: 1,
          everSub: 1,
          grade: 1,
          lastUpdateTime: 1,
          readCount: 1,
          shareCount: 1,
          likeCount: 1,
          commentCount: 1,
          // gradex: [ "$grade", "$readCount", '$shareCount' ]
          gradex: {
            $add: [
              {$multiply: [ "$grade", 100 ]},
              {$multiply: [ "$readCount", 0.1 ]},
              {$multiply: [ "$shareCount", 5 ]},
              {$multiply: [ "$likeCount", 1 ]},
              {$multiply: [ "$commentCount", 3 ]},
            ]}
        }},
      {$match: {user: {$eq: require('mongoose').Types.ObjectId(id)}}},
      {$sort: {gradex: 1}},
      {$group: {_id: '$user', book: {$addToSet: '$book'}, gradex: {$addToSet: '$gradex'}}},
    ])
    return {
      behavior: temp,
      personalInfo: personal[0]
    }
  }
}

module.exports = Object.assign(dao, {server})
