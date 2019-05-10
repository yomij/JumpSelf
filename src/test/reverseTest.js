const reserve = require('../novel/reserve')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
const bookDao = require('../db/book')
const chapterDao = require('../db/chapter')
const proxyText = require('./proxyTest')
const color = require('../utils/getMainColor')
const config = require('../config').novelWebConfig
const reserveIndex = require('../novel')

const file = require('../utils/file')

const async = require('async');
const spiderConfig = {
	CONCURRENCY_COUNT: 3,
	MAX_SINGLE_COUNT: 100
}

async function spider(book, clist) {
	// const proxys = await proxyText.getProxyList()
	let bookInfo
	if (typeof book === 'string') {

	// 	async.someLimit(proxys, 10, async function (p) {
	// 		console.log(p)
	// 		const res = await reserve.getBook(book, p)
	// 		if (!res.message) {
	// 			console.log(res)
	// 			return res
	// 		} else {
	// 			console.log(res.message)
	// 		}
	//
	// 	}, function (result) {
	// 		// console.log(result, result.message)
	// 	});
	// }
	// console.log('aaaaaaa')

		try {
			bookInfo = await reserve.getBook(book)
		} catch (e) {
			console.log('failed', e.message)
			// return spider(book)
			return
		}
		console.log('a')
		if(!bookInfo.mainImg && !bookInfo.mainImg.colors){
			bookInfo.mainImg = await color(bookInfo.mainImg.url)
		}

		console.log(bookInfo)
		book = await bookDao.server.insert(bookInfo)
		book.chapterUrl = bookInfo.chapterUrl
	}
	const cs = clist ? clist : await reserve.getChapters(book.chapterUrl)
	console.log(cs)
	let list = []
	while (cs.length) {
		list.push(cs.splice(0, spiderConfig.MAX_SINGLE_COUNT))
	}
	let index = 0
	async.mapLimit(list, 1, function (subList, callback) {
		dos(subList, index++, book._id, callback)
	}, function (err, result) {
		const failed = []
		result.forEach(item => {
			failed.push(...item.data.failed)
		})
		console.log(err,failed.length, JSON.stringify(failed))
	})
}

function dos(list, index, bookId, subCallback) {
	async.mapLimit(list, spiderConfig.CONCURRENCY_COUNT, function (cs, callback) {
		cs = Object.assign(cs, {
			bookId,
			_id: bookId + cs.chapterNum
		})

		const random = Math.random()

		setTimeout(() => {
			if (random > 0.5) {
				reserve.getChapter(cs.source).then(res => {
					console.log(cs.source)
					cs.content = res
					cs.success = true
					callback(null, cs)
				}).catch(e => {
					cs.success = false
					cs.content = ''
					callback(null, cs)
				})
			} else {
				const id = cs.source.split('/')[4]
				reserve.getChapterM(id, cs.chapterNum + 1).then(res => {
					cs.content = res
					cs.success = true
					callback(null, cs)
				}).catch(e => {
					cs.success = false
					cs.content = ''
					callback(null, cs)
				})
			}

		}, (cs.chapterNum - spiderConfig.MAX_SINGLE_COUNT * index) * random * spiderConfig.SPIDER_TIMEOUT)
		
	}, function (err, result) {
		let failed = []
		const success = result.filter(item => {
			if (!item.success) failed.push(item)
			return item.success
		})
		// 写入数据库
		chapterDao.insertChapters(result)
		if (!err) {
			subCallback(null, {
				index,
				success: true,
				data: {
					failed,
					success
				}
			})
		} else {
			subCallback(null, {
				index,
				success: false,
				data: {
					failed: list,
					success: []
				}
			})
		}
	});
}

async function insertBooksHottest (page = 1, chapters = false) {
	const bookurlList = await reserve.getHottestURL(page)
	console.log(bookurlList, bookurlList.length)
	async.mapLimit(bookurlList, 1, async function (book, callback) {
		let bookInfo = null
		try {
			console.log(book)
			bookInfo = await reserve.getBook(book)
			console.log(bookInfo)
			bookInfo.mainImg = await color(bookInfo.mainImg.url)
			book = await bookDao.server.insert(bookInfo)
			book.chapterUrl = bookInfo.chapterUrl
			const cs = await reserve.getChapters(book.chapterUrl, book._id)
			if(!chapters)await chapterDao.insertChapters(cs)
			else {
				let list = []
				while (cs.length) {
					list.push(cs.splice(0, spiderConfig.MAX_SINGLE_COUNT))
				}
				let index = 0
				console.log(book.title ? book.title : book + '开始获取')
				return async.mapLimit(list, 1, function (subList, callback) { // 开始分批抓取章节
					dos(subList, index++, book._id, callback)
				}, function (err, result) {
					const failed = []
					result.forEach(item => { // 一本书抓取完成 打印失败内容
						failed.push(...item.data.failed)
					})
					console.log(err,failed.length, JSON.stringify(failed))
					file.writeJson(failed, book.title + ' ' + book._id || 'failed'  + ' ' + book._id, 'F_PATH')
				})
			}
		} catch (e) {
			console.log('failed', e.message)
			// return spider(book)
			return {
				book,
				data: {title: e.message}
			}
		}
		
	}, function (err, result) {
		if(err) console.log(err.message)
		file.writeJson(result, 'hotBookPage' + page, 'FB_PATH')
	})
}

async function chapter(s) {
	const arr = 'https://read.ixdzs.com/66/66746/p3.html'.split('/')
console.log(	arr.pop().match(/\d+/g)[0], arr.pop())
	// return await reserveIndex.getChapter(s)
}



// /d/217/217500/


spider('/d/64/64960/')
// insertBooksHottest(4, true)
// chapter()








// async function getChapter() {
// 	console.log(await reserve.getChapterM(book.split('/')[3], 1))
// }
//
// getChapter()
