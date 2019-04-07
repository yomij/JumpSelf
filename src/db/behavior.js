const DB = require('../utils/dbConnect')

const db = new DB('yomi', 27017)

const userSchema = db.createSchema({
  bookId: { type: db.mongoose.Schema.Types.ObjectId, ref: 'Book' },
  userId:{ type: db.mongoose.Schema.Types.ObjectId, ref: 'User' },
  time: Date,
  type: Number, // 0 订阅, 1 分享， 2 阅读， 4 点击
})

const UserModel = db.connect().model('user', userSchema);

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
    return await UserModel.findById(id, {_id: 0, __v: 0})
  }
}
