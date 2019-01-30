const rankingList = require('../novel/rankingList')
const file = require('../utils/file')
const DB = require('../utils/dbConnect')

const Book = require('../db/book')
const Chapter = require('../db/chapter')

const COUNT = 5
const failedNum = []

async function testBook () {
	let book = await rankingList.getBook()
	const list = book.chapter
	const length = book.chapter.length
	book = book.info
	const bookId = await Book.insertBook({
		title: book.title, // 标题
		mainImg: book.mainImg, // 主图
		author: book.author, // 作者
		tags: [book.tags], // 标签
		createTime: new Date(), // 创建时间
		totalWords: book.totalWords, // 总字数
		latestUpdate: book.latestUpdate, // 最后更新
		description: book.description, // 描述
		status: book.status === '连载' ? 1 : 0, // 0 完结 1 更新中
		heat: 1, // 热度
	})
	let i = 0
	getChaper(list, bookId, ++i)
}

async function getChaper (list, bookId, i) {
	let chapters = []
	try {
		await sleep(3000)
		const content = await rankingList.getChapter(list[i].url)
		chapters.push({
			bookId,
			chapterNum: list[i].num,
			title: list[i].title,
			content,
			wordContent: content.length,
			createTime: new Date()
		})
		await Chapter.insertChapters(chapters)
		getChaper(list, bookId, ++i)
	} catch(e) {
		console.log(e.message)
		failedNum.push(i)
		console.log(failedNum)
		return
	}
}

function getBreakpoint(id) {
	chapter.findLast('5c4ec2ba2dde4d2e0cc54657', 1).then((err, doc) => console.log(err, doc))
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}


function start() {
	testBook()
}

start()

// getBreakpoint()
