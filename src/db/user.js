const DB = require('../utils/dbConnect')

const db = new DB('yomi', 27017)

const userSchema = db.createSchema({
  openId: String,
  phoneNum: String,
  nickname: String,
  avatarUrl: String,
  createTime: {type: Date, default: new Date}
})

const chapterModel = db.connect().model('chapter', chapterSchema);

chapterSchema.index({bookId: 1})


module.exports = {
  model: chapterModel,
  insertChapters(chapters) {
    return new Promise((resolve, reject) => {
      chapterModel.insertMany(chapters, (err, docs) => {
        if (err) {
          reject(err)
        }
        resolve(docs)
      })
    })
  },
  findLast (id, count) {
    return chapterModel.find({ bookId: id }).sort({chapterNum : -1}).limit(count)
  }
}
