const DB = require('../utils/dbConnect')

const db = new DB('yomi', 27017)

const commentSchema = db.createSchema({
  bookId: { type: db.mongoose.Schema.Types.ObjectId, ref: 'book' },
  chapterId:  { type: String, ref: 'chapter' },
  user: { type: db.mongoose.Schema.Types.ObjectId, ref: 'user' },
  content: String,
  createTime: {type: Date, default: new Date},
})

const commentModel = db.connect().model('comment', commentSchema);


module.exports = {
  model: commentModel,
  insertComment(comment) {
    const ct = new commentModel(comment);
    return ct.save()
  },
  findByChapter(id) {
    return commentModel
      .find({chapterId: id})
      .populate('user')//注意这是联合查询的关键
  }
}