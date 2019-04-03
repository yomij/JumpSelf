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
	// await reserve.getBook()
	const cs = await reserve.getChapters()

	cs.forEach((item, index) => {
		async.mapLimit(cs, 10 , async function (cs, callback) {
			const content = await reserve.getChapter(cs.source)
			console.log(content)
			callback(null, content)
		}, function (err,result) {
			// 4000 个 URL 访问完成的回调函数
			// ...
			console.error('end', result)
		});
		
	})
	
	eq.after('chapter', cs.length, (err, content) => {
		console.log(content)
	})
}





testBook()

async.parallel([
		function(callback) {
			setTimeout(function() {
				callback(null, 'one');
			}, 200);
		},
		function(callback) {
			setTimeout(function() {
				callback(null, 'two');
			}, 100);
		}
	],
// optional callback
	function(err, results) {
		// the results array will equal ['one','two'] even though
		// the second function had a shorter timeout.
		console.log(results)
	});

// getBreakpoint()
