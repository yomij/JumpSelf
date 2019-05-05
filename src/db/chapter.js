const DB = require('../utils/dbConnect')

const db = new DB('yomi', 27017)

const chapterSchema = db.createSchema({
	_id: String,
	bookId: { type: db.mongoose.Schema.Types.ObjectId, ref: 'Book' },
	chapterNum: Number,
	title: String,
	content: String,
	wordCount: Number,
	createTime: {type: Date, default: new Date},
	source: String // 来源地址
})

const chapterModel = db.connect().model('chapter', chapterSchema);

chapterSchema.index({bookId: 1})


module.exports = {
	model: chapterModel,
	insertChapters(chapters) {
		return new Promise((resolve, reject) => {
			chapterModel.insertMany(chapters, (err, docs) => {
				if (err) {
					reject(err)
				}
				resolve(docs)
			})
		})
	},
  async findChaptersByBookId(id, pageNo, size) {
    const totalCount = await chapterModel.countDocuments({ bookId: id })
    const chapterList = await chapterModel.find({ bookId: id }, 'createTime _id title chapterNum').sort({chapterNum : 0}).skip((pageNo - 1) * size).limit(size)
    return {
      totalCount,
      chapterList
    }
  },
	async findChaptersMore(id, num, size) {
		const totalCount = await chapterModel.countDocuments({ bookId: id })
		const chapterList = await chapterModel.find({
			bookId: id,
			chapterNum: {$gt: num}
		}, 'createTime _id title chapterNum').sort({chapterNum : 0}).limit(size)
		return {
			totalCount,
			chapterList
		}
	},
  findChapterById (id) {
    return chapterModel.findById(id)
  },
	findLast (id, count) {
		return chapterModel.find({ bookId: id }).sort({chapterNum : -1}).limit(count)
	},
	findFirst (id) {
		return chapterModel.findOne({ bookId: id, chapterNum: 0 })
	},
	async updateChapter (id, content) {
		return await chapterModel.updateOne({_id: id}, {content})
	}
}
