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
  //抽离
  latestUpdate: Date, // 最后更新时间
  latestUpdateName: String, // 最后更新章节

  // 评分
  gradeTotal: {default: 5, type: Number},
  gradeCount: {default: 1, type: Number},

  description: String, // 描述
  status: Number, // 0 完结 1 更新中
  heat: {type: Number, default: 0}, // 热度

  todayClick: {type: Number, default: 0}, // 今日点击
  lastClickTime: Date, // 最后点击时间
  clickCount: {type: Number, default: 0},

  todayRead: {type: Number, default: 0}, // 今日点击
  lastClickTime: Date, // 最后点击时间
  readCount: {type: Number, default: 0},

  todaySubscription: {type: Number, default: 0}, // 今日订阅
  lastSubscriptionTime: Date, // 最后订阅时间
  subscriptionCount: {type: Number, default: 0},

  todayRecommend: {type: Number, default: 0}, // 今日推荐
  lastRecommendTime: Date, // 最后推荐时间
  recommendCount: {type: Number, default: 0}, // 推荐总数
  isDelete: {type: Number, default: 0},
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
    return bookModel.findOne({_id, isDelete: 0}, {extra: 0});
  },
  getHeaterByTag (mainTags, limit) {
    // 玄幻奇幻 网游竞技 科幻奇异 历史军事 侦探推理  修真仙侠 言情穿越 耽美同人  都市青春
    return bookModel.find({
      isDelete: 0,
      mainTag: {$in: mainTags}
    }, {extra: 0}).sort({heat: -1}).limit(limit)
  },
  getMostClickByTag (mainTags, ids = [], limit) {
    // 玄幻奇幻 修真仙侠 都市青春 历史军事 网游竞技 科幻奇异 言情穿越 耽美同人 侦探推理
    return bookModel.find({
      isDelete: 0,
      mainTag: {
        $in: mainTags
      },
      _id: {
        $nin: ids
      }
    }, {extra: 0}).sort({clickCount: -1}).limit(limit)
  },

  // 每日点击
  getMostClickDaily (mainTags, ids = [], limit) {
    // 玄幻奇幻 修真仙侠 都市青春 历史军事 网游竞技 科幻奇异 言情穿越 耽美同人 侦探推理
    return bookModel.find({
      isDelete: 0,
      mainTag: {
        $in: mainTags
      },
      _id: {
        $nin: ids
      }
    }, {extra: 0}).sort({todayClick: -1}).limit(limit)
  },

  // 每日订阅
  getMostSubscriptionDaily (mainTags, ids = [], limit) {
    // 玄幻奇幻 修真仙侠 都市青春 历史军事 网游竞技 科幻奇异 言情穿越 耽美同人 侦探推理
    return bookModel.find({
      isDelete: 0,
      mainTag: {
        $in: mainTags
      },
      _id: {
        $nin: ids
      }
    }, {extra: 0}).sort({todaySubscription: -1}).limit(limit)
  },

  // 重置每日数据
  async updateCount(mainTags) {
    return await updateMany({mainTag: {$in: mainTags}}, {
      todayClick: 0,
      todaySubscription: 0,
      todayRecommend: 0
    })
  },

  async search (text, pageNo = 1, pageSize = 10) {
    const reg = new RegExp(text)
    const totalCount = await bookModel.countDocuments({
      $or : [ //多条件，数组
        {title : {$regex : reg}},
        {author : {$regex : reg}}
      ]
    })
    const result = await bookModel.find( {
      $or : [ //多条件，数组
        {title : {$regex : reg}},
        {author : {$regex : reg}}
      ]
    }).limit(pageSize).sort({heat: -1}).skip((pageNo - 1) * pageSize)
    return  {
      totalCount,
      result
    }
  },
  async searchAuthor (text) {
    const reg = new RegExp(text)
    return await bookModel.find({author : {$regex : reg}}, 'author')
      .limit(1).sort({heat: -1})
  },
  async searchByAuthor (name) {
    return await bookModel.find({author: name}, 'author title').sort({heat: -1})
  },
  async searchBook (text, count) {
    const reg = new RegExp(text)
    return await bookModel.find({title : {$regex : reg}}, 'author title').limit(count).sort({heat: -1})
  },
  // 添加点击
  async addClick(id, lastClickTime, clickCount) {
    return await bookModel.findByIdAndUpdate(id, {
      lastClickTime,
      $inc:{
        todayClick: clickCount,
        clickCount: clickCount,
        heat: clickCount
      }
    })
  },
  // 添加订阅
  async addSubscription(id, lastSubscriptionTime) {
    return await bookModel.findByIdAndUpdate(id, {
      lastSubscriptionTime,
      $inc:{
        todaySubscription: 1,
        subscriptionCount: 1,
        heat: 50
      }
    })
  },
  // 添加推荐
  async addRecommend(id, lastSubscriptionTime, count) {
    return await bookModel.findByIdAndUpdate(id, {
      lastSubscriptionTime,
      $inc:{
        todayRecommend: count,
        recommendCount: count,
        heat: count * 15
      }
    })
  },
  // 添加评分
  async addGrade(id, grade) {
    return await bookModel.findByIdAndUpdate(id, {
      $inc:{
        gradeTotal: grade,
        gradeCount: 1
      }
    })
  },
  // 批量添加
  async addTotal (id, click, recommend, read, like, comment) {
    return await bookModel.findByIdAndUpdate(id, {
      $inc:{
        todayClick: click,
        clickCount: click,
        todayRecommend: recommend,
        recommendCount: recommend,
        todayRead: read,
        readCount: read,
        heat: click + recommend * 10 + read + like + comment
      }
    })
  }
}


const chapter = require('./chapter')
const user = require('./user')
const commentD = require('./comment')

const server = {
  async insert(book) {
    console.log(book)
    const result = await bookModel.findByNameAndAuthor(book.title, book.author)
    if (result.length) {
      return result[0]
      // throw new Error(`book name:${book.title} author:${book.author} is already exist`)
      
    } else {
      return await dao.insertBook(book)
    }
  },
  async getBookDetail (bookId, userId) {
    let book = await dao.getBookById(bookId)
    if (!book) {
      throw new Error('no such book')
    } else {
      let subscription = false
      if (userId) {
        subscription = await user.getSubscription(userId, bookId)
      }
      const first = await chapter.findFirst(bookId)
      const comment = await commentD.getCommentByBook(bookId, 1, 3, userId)
      if (!first) {
        throw new Error('cannot find first chapter')
      } else {
        return {
          isSubscription: subscription ? true : false,
          book,
          firstChapter: first,
          comment
        }
      }
    }
  },
  async preSearch (text) {
    let result = {}
    const book = await dao.searchAuthor(text)
    if (book.length) {
      const author = book[0].author
      const books = await dao.searchByAuthor(author)
      result.author = author
      result.authorBooks = books
    }
    const searchBooks = await dao.searchBook(text, 10)
    result.searchBooks = searchBooks
    return result
  },
  async getBookByIds (bookIds, userId) {
    // userId
    let books = await bookModel.find({_id: {$in: bookIds}}).lean()
    for(let i = 0; i < books.length; i++) {
      books[i].isSub = await user.getSubscription(userId, books[i]._id) ? true : false
    }
    return books
  },
}

module.exports = Object.assign(dao, {server})

