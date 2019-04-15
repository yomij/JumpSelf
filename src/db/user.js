const DB = require('../utils/dbConnect')

const db = new DB('yomi', 27017)

const userSchema = db.createSchema({
  openId: String,
  phone: String,
  nickname: String,
  avatarUrl: String,
  createTime: {type: Date, default: new Date},
  email: String,
  subscription: [{
    title: String,
    id: String,
    mainImg: String,
    author: String,
    tag: String,
    lastRead: String,
    lastReadTime: Date,
    time: Date
  }]
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
  },

  async addSub (userId, subscription) {
    return await UserModel.update({
      _id: userId
    }, {
      '$push': {
        subscription
      }
    });
  },
  
  async unSub (userId, subBookId) {
    //删除
    return await UserModel.update({_id: userId}, {'$pull':{ subscription : { id : subBookId }}});
  }

}
