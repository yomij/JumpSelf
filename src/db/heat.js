const DB = require('../utils/dbConnect')

const db = new DB('yomi', 27017)

const heatSchema = db.createSchema({
  bookId: { type: db.mongoose.Schema.Types.ObjectId, ref: 'Book' },
  todayClick: Number, // 今日点击
  lastClickTime: Date, // 最后点击时间
  clickCount: Number,
  todaySubscription: Number, // 今日订阅
  lastSubscriptionTime: Date, // 最后订阅时间
  subscriptionCount: Date,
  todayRecommend: Number, // 今日推荐
  lastRecommendTime: Date, // 最后推荐时间
  recommendCount: Number
})

const heatModel = db.connect().model('heat', heatSchema);

heat.index({bookId: 1})


module.exports = {
  model: heatModel,
  insertChapters(chapters) {
    return new Promise((resolve, reject) => {
      heatModel.insertMany(chapters, (err, docs) => {
        if (err) {
          reject(err)
        }
        resolve(docs)
      })
    })
  },
  findLast (id, count) {
    return heatModel.find({ bookId: id }).sort({chapterNum : -1}).limit(count)
  }
}
