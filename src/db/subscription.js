const DB = require('../utils/dbConnect')
const bookDao =  require("./book")
const db = new DB('yomi', 27017)

const subscriptionSchema = db.createSchema({
  openId: String,
  phone: String,
  nickname: String,
  avatarUrl: String,
  createTime: {type: Date, default: new Date},
  email: String,
  subscription: [{
    book: { type: db.mongoose.Schema.Types.ObjectId, ref: 'book' },
    behavior: { type: db.mongoose.Schema.Types.ObjectId, ref: 'behavior' }, // 行为编号
    lastRead: String,
    lastReadTime: Date,
    time: {type: Date, default: Date.now()},
    isMain: {type: Boolean, default: false}
  }]
})

const UserModel = db.connect().model('user', subscriptionSchema);

// chapterSchema.index({bookId: 1})

module.exports = {
  model: UserModel,
  async insertUser(user) {
    const u = new UserModel(user)
    const info = await u.save()
    return info
  },
  queryUserByOpenId (openId) {
    return new Promise((resolve, reject) => {
      UserModel.find({openId}, '_id nickname phone openId', (err, doc) => {
        if (err) reject(err)
        resolve(doc)
      })
    })
  },
  queryUserByPhone (phoneNum) {
    return new Promise((resolve, reject) => {
      UserModel.find({phoneNum}, '_id openId nickname', (err, doc) => {
        if (err) reject(err)
        resolve(doc)
      })
    })
  },
  async queryUserById (id) {
    console.log(id)
    return await UserModel.findById(id, {_id: 0, __v: 0}).populate('subscription.book')
  },
  async unSub (userId, subBookId) {
    //删除
    return await UserModel.update({_id: userId}, {'$pull':{ subscription : { id : subBookId }}});
  },
  async overhead (bookId) {

  },
  server: {
    async addSub (userId, bookId) {
      // console.log('a')
      // let subscription = await bookDao.getBookById(bookId)
      // if (subscription) {
      //   subscription = JSON.parse(JSON.stringify(subscription))
      // }
      // subscription.book = bookId
      // console.log(subscription)
      return await UserModel.updateOne({
        _id: userId
      }, {
        '$push': {
          subscription: {
            book: bookId
          }
        }
      });
    },
  },

}
