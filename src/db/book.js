const DB = require('../utils/dbConnect')

const db = new DB('yomi', 27017)

const bookSchema = db.createSchema({
	title: String, // 标题
	mainImg: String, // 主图
	author: String, // 作者
	tags: [String], // 标签
	createTime: Date, // 创建时间
	totalWords: Number, // 总字数
	latestUpdate: Date, // 最后更新
	description: String, // 描述
	status: Number, // 0 完结 1 更新中
	heat: Number, // 热度
	urls: [], // 书籍urls
})

bookSchema.static('findByNameAndAuthor', function (title = '', author = '', callback) {
	return this.find({ title, author }, callback);
});

const bookModel = db.connect().model('book', bookSchema); //创建collection

module.exports = {
	model: bookModel,
	insertBook(book) {
		return new Promise((resolve, reject) => {
			const nt = new bookModel(book);
			nt.save((err, doc) => {
				if (err) {
					reject(err)
				} else {
					resolve(doc._id)
				}
			})
		})
	},
}
