const reserve = require('../novel/reserve')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
const bookDao = require('../db/book')
const chapterDao = require('../db/chapter')
const proxyText = require('./proxyTest')
const color = require('../utils/getMainColor')
const config = require('../config').novelWebConfig

const async = require('async');
const spiderConfig = {
	CONCURRENCY_COUNT: 5,
	MAX_SINGLE_COUNT: 10
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
			console.log(book)
			bookInfo = await reserve.getBook(book)
			console.log(bookInfo)
		} catch (e) {
			console.log('failed', e.message)
			// return spider(book)
			return
		}
		bookInfo.mainImg = await color(bookInfo.mainImg.url)
		console.log(bookInfo)
		book = await bookDao.server.insert(bookInfo)
		book.chapterUrl = bookInfo.chapterUrl
	}
	const cs = clist ? clist : await reserve.getChapters(book.chapterUrl)
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

spider('/d/215/215024/')

// async function getChapter() {
// 	console.log(await reserve.getChapterM(book.split('/')[3], 1))
// }
//
// getChapter()
