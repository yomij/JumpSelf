const Router = require('koa-router');

let book = new Router({
	prefix: '/api2b/book'
});

const reserve = require('../novel/reserve')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"


const async = require('async');
const eventproxy = require('eventproxy');
const ep = new eventproxy()

const spiderConfig = {
	CONCURRENCY_COUNT: 10,
	MAX_SINGLE_COUNT: 100
}

async function testBook() {
	// let book = await reserve.init(res)
	const book = await reserve.getBook()
	const cs = await reserve.getChapters(book.chapterUrl)
	const length = cs.length
	const count = Math.floor(length / spiderConfig.MAX_SINGLE_COUNT)
	const list = []
	while (cs.length) {
		list.push(cs.splice(0, spiderConfig.MAX_SINGLE_COUNT))
	}
	let index = 0
	async.mapLimit(list, 1, function (subList, callback) {
		dos(subList, index++, callback)
	}, function (err, result) {
		console.log(err, result)
	})
}


function dos(list, index, subCallback) {
	global.socket.book(`第${index + 1} 轮抓取开始。。。<br/>`)
	async.mapLimit(list, spiderConfig.CONCURRENCY_COUNT, function (cs, callback) {
		reserve.getChapter(cs.source).then(res => {
			console.log(cs.source)
			cs.content = res
			cs.success = true
			global.socket.book(`章节编号:${cs.chapterNum} ${cs.title} 抓取成功<br/>`)
			callback(null, cs)
		}).catch(e => {
			cs.success = false
			cs.content = e.message
			callback(null, cs)
			global.socket.book(`章节编号:${cs.chapterNum} ${cs.title} 抓取失败，失败理由：${e.message}<br/>`)
		})
	}, function (err, result) {
		let failed = []
		const success = result.filter(item => {
			if (!item.success) failed.push(item)
			return item.success
		})
		if (!err) {
			subCallback(null, {
				index,
				success: true,
				data: {
					failed,
					success
				}
			})
			// 写入数据库
		} else {
			subCallback(null, {
				index,
				success: false
			})
		}
		global.socket.book(`第${index + 1} 轮抓取结束<br/>`)
	});
}


// async.parallel([
// 		function(callback) {
// 			setTimeout(function() {
// 				callback(null, 'one');
// 			}, 200);
// 		},
// 		function(callback) {
// 			setTimeout(function() {
// 				callback(null, 'two');
// 			}, 100);
// 		}
// 	],
// // optional callback
// 	function(err, results) {
// 		// the results array will equal ['one','two'] even though
// 		// the second function had a shorter timeout.
// 		console.log(results)
// 	});

// getBreakpoint()


book.get('/add', async (ctx, next) => {
	testBook()
	ctx.body = '抓取开始'
})


module.exports = book;
