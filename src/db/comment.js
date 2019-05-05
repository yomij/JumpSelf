const DB = require('../utils/dbConnect')

const db = new DB('yomi', 27017)

const commentSchema = db.createSchema({
  book: { type: db.mongoose.Schema.Types.ObjectId, ref: 'book' },
  chapter:  { type: String, ref: 'chapter' },
  user: { type: db.mongoose.Schema.Types.ObjectId, ref: 'user' },
  content: String,
  likeCount: { type: Number, default: 0 },
  like: Array,
  createTime: { type: Date, default: new Date },
})

const commentModel = db.connect().model('comment', commentSchema);


const dao = {
  async getUserLike (userId) {
    return await commentModel.find({
      like: userId
    })
  },
}


module.exports = {
  model: commentModel,
  async addComment (bookId, chapterId, userId, content) {
    const comment = new commentModel({
      book: bookId,
      chapter: chapterId,
      user: userId,
      content: content
    });
    await comment.save()
    return comment.populate({
      path: 'user',
      select: 'nickname avatarUrl',
    }).execPopulate()
  },
  async getCommentByLike (chapterId, pageNo, pageSize, userId) {
    const totalCount = await commentModel.countDocuments({ chapter: chapterId })
    let result = await commentModel.find({
      chapter: chapterId
    }, '-like -book').sort('-likeCount').populate({
      path: 'user',
      select: 'nickname avatarUrl -_id likeCount',
    }).populate({
      path: 'chapter',
      select: 'title -_id',
    }).limit(pageSize).skip((pageNo - 1) * pageSize).lean()
    if (userId) {
      const like = await dao.getUserLike(userId)
      if (like && like.length) {
        result.forEach(item => {
          like.some(l => {
            console.info(l._id + '  ' + item._id)
          })
          if (like.some(l => l._id.equals(item._id))) {
            item.isLike = true
          } else {
            item.isLike = false
          }
        })
      }
    }
    return {
      totalCount,
      result
    }
  },
  async getComment (chapterId, pageNo, pageSize, userId) {
    const totalCount = await commentModel.countDocuments({ chapter: chapterId })
    let result = await commentModel.find({
      chapter: chapterId
    }, '-like -book').sort('-createTime').populate({
      path: 'user',
      select: 'nickname avatarUrl -_id',
    }).populate({
      path: 'chapter',
      select: 'title -_id',
    }).limit(pageSize).skip((pageNo - 1) * pageSize).lean()
    if (userId) {

      const like = await dao.getUserLike(userId)
      if (like && like.length) {
        result.forEach(item => {
          like.some(l => {
            console.info(l._id + '  ' + item._id)
          })
          if (like.some(l => l._id.equals(item._id))) {
            item.isLike = true
          } else {
            item.isLike = false
          }
        })
      }
    }
    return {
      totalCount,
      result
    }
  },
  async getCommentByBook (bookId, pageNo, pageSize, userId) {
    const totalCount = await commentModel.countDocuments({ book: bookId })
    let result = await commentModel.find({
      book: bookId
    }, '-like -book').sort('-likeCount').populate({
      path: 'user',
      select: 'nickname avatarUrl -_id',
    }).populate({
      path: 'chapter',
      select: 'title -_id',
    }).limit(pageSize).skip((pageNo - 1) * pageSize).lean()
    if (userId) {
      const like = await dao.getUserLike(userId)
      if (like && like.length) {
        result.forEach(item => {
          like.some(l => {
            console.info(l._id + '  ' + item._id)
          })
          if (like.some(l => l._id.equals(item._id))) {
            item.isLike = true
          } else {
            item.isLike = false
          }
        })
      }
    }
    return {
      totalCount,
      result
    }
  },
  async like(id, userId) {
    return await commentModel.findOneAndUpdate({
      _id: id
    }, {
      '$addToSet': {
        like: userId
      },
      $inc:{
        likeCount: 1
      }
    })
  },
  async unlike(id, userId) {
    return await commentModel.findOneAndUpdate({
      _id: id
    }, {
      '$pull': {
        like: userId
      },
      $inc:{
        likeCount: -1
      }
    })
  }
}