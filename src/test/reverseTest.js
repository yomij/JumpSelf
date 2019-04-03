const reserve = require('../novel/reserve')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
const file = require('../utils/file')
const DB = require('../utils/dbConnect')

const Book = require('../db/book')
const Chapter = require('../db/chapter')

const COUNT = 5
const failedNum = []

const res = require('./html')

const async = require('async');
const eventproxy = require('eventproxy');
const eq = new eventproxy()


async function testBook () {
	// let book = await reserve.init(res)
	const book = await reserve.getBook()
	const cs = await reserve.getChapters(book.chapterUrl)
console.log(cs)
	async.mapLimit(cs, 20,  function (cs, callback) {
		reserve.getChapter(cs.source).then(res => {
			console.log(cs.source)
			cs.content = res
			callback(null, cs)
		})

	}, function (err,result) {
		// 4000 个 URL 访问完成的回调函数
		// ...
		console.error('end',err, result)
	});

}





testBook()

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
