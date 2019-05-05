const DB = require('../utils/dbConnect')

const db = new DB('yomi', 27017)

const likeSchema = db.createSchema({
  comment: { type: db.mongoose.Schema.Types.ObjectId, ref: 'comment' },
  user: { type: db.mongoose.Schema.Types.ObjectId, ref: 'user' },
  content: String,
  likeCount: { type: Number, default: 0 },
  createTime: { type: Date, default: new Date },
})

const commentModel = db.connect().model('comment', commentSchema);


module.exports = {
  model: commentModel,
  async addComment (bookId, chapterId, userId, content) {
    const comment = new commentModel({
      book: bookId,
      chapter: chapterId,
      user: userId,
      content: content
    });
    return await comment.save()
  },
  async getCommentByLike (chapterId, pageNo, pageSize) {
    const totalCount = await commentModel.countDocuments({ chapter: chapterId })
    const result = await commentModel.find({chapter: chapterId}).sort('-likeCount').populate({
      path: 'user',
      select: 'nickname avatarUrl -_id',
    }).populate({
      path: 'chapter',
      select: 'title -_id',
    }).limit(pageSize).skip((pageNo - 1) * pageSize)
    return {
      totalCount,
      result
    }
  },
  async getComment (chapterId, pageNo, pageSize) {
    const totalCount = await commentModel.countDocuments({ chapter: chapterId })
    const result = await commentModel.find({chapter: chapterId}).sort('-createTime').populate({
      path: 'user',
      select: 'nickname avatarUrl -_id',
    }).populate({
      path: 'chapter',
      select: 'title -_id',
    }).limit(pageSize).skip((pageNo - 1) * pageSize)
    return {
      totalCount,
      result
    }
  }

}