const DB = require('../utils/dbConnect')

const db = new DB('yomi', 27017)

const behaviorSchema = db.createSchema({
  book: { type: db.mongoose.Schema.Types.ObjectId, ref: 'book' },
  user:{ type: db.mongoose.Schema.Types.ObjectId, ref: 'user' },
  interest: Number,
  lastUpdateTime: {type: Date, default: Date.now()}, // 最后行为时间 （不包括点击）
  everSub: {default: false, type: Boolean}, // 订阅过
  grade: {default: 0, type: Number}, // 评分
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
  },
  async getLatestBehavior(id, count) {
  
  },
  async getToppGrade(id, count) {
  
  },
  async getUserBehavior(id, count) {
    return await behaviorModel.find({user: id}).sort({lastUpdateTime: -1}).limit(count).populate('book')
  },
  async getSubBooks (id) {
    return await behaviorModel.find({user: id}, '-_id book')
  },
  async getUserBehaviorTop(id, count) {
    return await behaviorModel.find({user: id}).sort({grade: -1}).limit(count).populate('book')
  }

}

const bookDao  = require('./book')

const server = {
  async add (userId, books, data) {
    if(!data.length) return
    for(let i = 0; i< data.length; i++) {
      const {clickCount = 0, shareCount = 0, readCount = 0, likeCount = 0, commentCount = 0, totalReadTime = 0} = data[i].data
      const {lastUpdateTime} = data[i]
      const insert = {
        $inc: {
          clickCount,
          shareCount,
          readCount,
          likeCount,
          commentCount,
          totalReadTime
        }
      }
      if (lastUpdateTime) {
        insert.lastUpdateTime = lastUpdateTime
      }
      await behaviorModel.update({
        book: books[i],
        user: userId
      }, insert, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      })
      await bookDao.addTotal(books[i], ~~clickCount , ~~shareCount, ~~readCount, ~~likeCount, ~~commentCount)
    }
    return true
  },
  async getRecommendData() {
    let res = await behaviorModel.aggregate([
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
        }},
      {$match: {grade: {$gt: 0}}},
      {$group: {_id: '$book', user: {$addToSet: '$user'}, gradex: {$addToSet: '$grade'}}},

    ])
    const temp = {}
    res.map(item => {
      temp[item._id] = {}
      item.user.forEach((u, i) => {
        temp[item._id][u] = item.gradex[i]
      })
    })
    return temp
  },
  async getRecommendDataToppest() {
    let res = await behaviorModel.aggregate([
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
        }},
      {$match: {grade: {$gt: 0}}},
      {$group: {_id: '$book', user: {$addToSet: '$user'}, gradex: {$addToSet: '$grade'}}},
    
    ])
    const temp = {}
    res.map(item => {
      temp[item._id] = {}
      item.user.forEach((u, i) => {
        temp[item._id][u] = item.gradex[i]
      })
    })
    return temp
  }
}

module.exports = Object.assign(dao, {server})
