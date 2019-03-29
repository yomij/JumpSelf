const DB = require('../utils/dbConnect')

const db = new DB('yomi', 27017)

const userSchema = db.createSchema({
  openId: String,
  phoneNum: String,
  nickname: String,
  avatarUrl: String,
  createTime: {type: Date, default: new Date},
  email: String,
  subscriptionList: [{
    title: String,
    id: String,
    mainImg: String,
    author: String,
    tag: String
  }]
})

const UserModel = db.connect().model('user', userSchema);

// chapterSchema.index({bookId: 1})


module.exports = {
  model: UserModel,
  insertUser(user) {
    const u = new UserModel(user)
    return new Promise((resolve, reject) => {
      u.save((err) => {
        if (err) reject(err)
        resolve()
      })
    })
  },
  queryUserByOpenId (openId) {
    return new Promise((resolve, reject) => {
      UserModel.find({openId}, '_id nickname', (err, doc) => {
        if (err) reject(err)
        resolve(doc)
      })
    })
  },
  querySubscription () {
  
  }
}
