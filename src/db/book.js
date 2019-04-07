const DB = require('../utils/dbConnect')
const db = new DB('yomi', 27017)
const bookSchema = db.createSchema({
  title: String, // 标题
  author: String, // 作者
  mainTag: String, // 主标签
  tags: Array, // 副标签
  createTime: { type: Date, default: Date.now()}, // 创建时间
  totalCount: Number, // 总字数
  chapterCount: Number, // 章节数

 // 抽离
  latestUpdate: Date, // 最后更新时间
  latestUpdateName: String, // 最后更新章节

  description: String, // 描述
  status: Number, // 0 完结 1 更新中
  heat: {type: Number, default: 0}, // 热度
  todayClick: {type: Number, default: 0}, // 今日点击
  lastClickTime: Date, // 最后点击时间
  clickCount: {type: Number, default: 0},
  todaySubscription: {type: Number, default: 0}, // 今日订阅
  lastSubscriptionTime: Date, // 最后订阅时间
  subscriptionCount: {type: Number, default: 0},
  todayRecommend: {type: Number, default: 0}, // 今日推荐
  lastRecommendTime: Date, // 最后推荐时间
  recommendCount: {type: Number, default: 0}, // 推荐总数
  mainImg: {
    url: String,
    colors: Array,
    allColor: Array,
    isDark: Boolean
  },
  extra: {
    urls: {
      mainUrl: String, // 主站链接
      reserveUrl: String, // 备用站点链接
    }, // 书籍urls
    isDelete: {type: Number, default: 0},
    deleteTime: Date
  }
})

bookSchema.static('findByNameAndAuthor', function (title = '', author = '') {
  return this.find({title, author});
});

const bookModel = db.connect().model('book', bookSchema); //创建collection

const dao = {
  model: bookModel,
  insertBook(book) {
    return new Promise((resolve, reject) => {
      const nt = new bookModel(book);
      nt.save((err, doc) => {
        if (err) {
          reject(err)
        } else {
          resolve(doc)
        }
      })
    })
  },
  getBookById(_id) {
    return bookModel.findById(_id, {extra: 0});
  },
  getHeaterByTag (mainTag, limit) {
    return bookModel.find({mainTag}, {extra: 0}).sort({heat: 1}).limit(limit)
  }

}


const chapter = require('./chapter')


const server = {
  async insert(book) {
    console.log(book)
    const result = await bookModel.findByNameAndAuthor(book.title, book.author)
    if (result.length) {
      throw new Error(`book name:${book.title} author:${book.author} is already exist`)
    } else {
      return await dao.insertBook(book)
    }
  },
  async getBookDetail (bookId) {
    let book = await dao.getBookById(bookId)
    if (!book) {
      throw new Error('no such book')
    } else {

      const first = await chapter.findFirst(bookId)
      if (!first) {
        throw new Error('cannot find first chapter')
      } else {
        return {
          book,
          firstChapter: first
        }
      }
    }
  }
}

module.exports = Object.assign(dao, {server})
