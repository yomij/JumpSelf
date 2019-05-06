const DB = require('../utils/dbConnect')
const bookDao =  require("./book")
const db = new DB('yomi', 27017)

const userSchema = db.createSchema({
  openId: String,
  phone: String,
  password: String,
  nickname: String,
  avatarUrl: String,
  createTime: {type: Date, default: new Date},
  email: String,
  totolReadTime: Number,
  subscription: [{
    book: { type: db.mongoose.Schema.Types.ObjectId, ref: 'book' },
    behavior: { type: db.mongoose.Schema.Types.ObjectId, ref: 'behavior' },
    lastRead: {
      id: { type: String, ref: 'chapter' },
      title: String
    },
    lastReadTime: Date,
    time: {type: Date, default: Date.now()},
    isMain: {type: Boolean, default: false}
  }]
})

const UserModel = db.connect().model('user', userSchema);

// chapterSchema.index({bookId: 1})

const dao = {
  model: UserModel,
  async insertUser(user) {
    const u = new UserModel(user)
    const info = await u.save()
    return info
  },
  queryUserByOpenId (openId) {
    return new Promise((resolve, reject) => {
      UserModel.find({openId}, '_id nickname phone openId avatarUrl', (err, doc) => {
        if (err) reject(err)
        resolve(doc)
      })
    })
  },
  async queryUserByPhone (phone) {
    return UserModel.find({phone}, '_id openId nickname avatarUrl password phone')
  },
  async getSubscription (userId, bookId) {
    return await UserModel.findOne({
      _id: userId,
      'subscription.book': bookId
    }, 'subscription.book')
  },
  async queryUserById (id) {
    return await UserModel.findById(id, {_id: 0, __v: 0, password: 0})
      .populate('subscription.book')
      .populate('subscription.behavior', 'clickCount grade lastUpdateTime readCount shareCount')
  }
}


const server = {
  async addSub (userId, bookId, behavior) {
    if(await dao.getSubscription(userId, bookId)) {
      throw new Error('subscription is already exist')
    }
    return await UserModel.updateOne({
      _id: userId
    }, {
      '$push': {
        subscription: {
          book: bookId,
          behavior
        }
      }
    });
  },
  /**
   *
   * @param userId 用户id
   * @param bookId 书籍Id
   * @param type 0 取消顶置 1 顶置
   * @returns {Promise<IDBRequest<IDBValidKey> | Promise<void> | void>}
   */
  async overhead (userId, bookId, type) {
    let res = null
    if (await dao.getSubscription(userId, bookId)) {
      res = await UserModel.updateOne({
        _id: userId,
        "subscription.book": bookId
      }, {$set: {"subscription.$.isMain": !!type}})
    } else {
      throw new Error('subscription does not exist')
    }
    return !!res.nModified
  },
  async unSub (userId, subBookId) {
    let res = null
    if (await dao.getSubscription(userId, subBookId)) {
      res = await UserModel.updateOne({_id: userId}, {'$pull':{ subscription : { book : subBookId }}});
    } else {
      throw new Error('subscription does not exist')
    }
    return !!res.nModified
  },
  async updatePhone (id, phone, password) {
    return await UserModel.findOneAndUpdate({_id: id}, {phone, password})
  },
  /**
   * 更新最后阅读
   * @param userId 用户id
   * @param bookId 书籍Id
   * @param chapterId 章节id
   * @returns {Promise<IDBRequest<IDBValidKey> | Promise<void> | void>}
   */
  async lastRead (userId, bookId, chapterId, title) {
    let res = null
    if (await dao.getSubscription(userId, bookId)) {
      res = await UserModel.updateOne({
        _id: userId,
        "subscription.book": bookId
      }, {$set: {
        "subscription.$.lastRead": {
          id: chapterId,
          title: title
        }
      }})
    } else {
      throw new Error('subscription does not exist')
    }
    return !!res.nModified
  },
}

module.exports = Object.assign(dao, {server})
