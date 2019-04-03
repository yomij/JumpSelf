
const superagent = require('superagent')
require('superagent-charset')(superagent)

const cheerio = require('cheerio');
const async = require('async');
const eventproxy = require('eventproxy');

const agent = require('./userAgent')
const config = {
	BASE_URL: 'https://www.ixdzs.com/bsearch?q=a'
}

module.exports = {
	// 获取排行榜列表
	init(res) {
		return new Promise((reslove, reject) => {
			// console.log(`${config.BASE_URL}`)
			// superagent.get(`${config.BASE_URL}`)
			// 	.charset('utf-8')
			// 	.set('X-Forwarded-For', '10.111.128.90')
			// 	.end((err, res) => {
			// 		if (err) {
			// 			reject(err)
			// 		} else {
			// 			let $ = cheerio.load(res.text);
			// 			console.log($('.box_k ul li').each(item => console.log(item)))
			// 		}
			// 	});
			let books = []
			let $ = cheerio.load(res.text);
			$('.box_k ul li').each((index, item) => {
				books[index] = {}
				item = $(item)
				console.log(item.find('.b_name').text())
				item.find('.b_info span').each((i, info) => {
					const names = ['author', 'totalCount', 'status', 'latestUpdate']
					if(i === 3) {
						const time = $(info)
					} else {
						books[index][names[i]] = $(info).text().split('：')[1]
					}
					
				})
			})
			reslove(books)
		})
	},
	/*
	*  获取书籍详细信息
	 * @Param 书籍信息 {
	 * 	name String 书籍名称
	 * 	url String 书籍路由
	 * }
	 *
	 * @Return promise({
	 * 	bookDetail Object 书籍详细信息
	 * 	chapterList Array[String] 书籍章节信息列表
	 * })
	 **/
	getBook(bookObj = {}) {
		console.log(`${config.RESERVE_URL}${'/ddk119775/'}`)
		return new Promise((reslove, reject) => {
			superagent.get(`${config.RESERVE_URL}${'/ddk119775/'}`)
				.end((err, res) => {
					if (err) {
						console.log(err)
						reject(err)
					} else {
						let $ = cheerio.load(res.text, {
							decodeEntities: false //禁用转码
						})
						const $info = $('#info')
						let info = {
							mainImg: `${config.BASE_URL}${$info.find('.cover img').attr('src')}`,
							title: $info.find('h1').text()
						}
						let chapter = []
						const key = ['author', 'tags', 'status', 'totalWords', 'latestUpdate', 'latestChapter']



						info['description'] = $info.find('.intro')[0].children[1].data.trim()
						let $item = $('.listmain dl dt').eq(1).next('dd')
						let i = 0
						while($item) {
							if(!$item[0]) break
							const $dd = $($item[0].children[0])
							chapter.push({
								title: `第${++i}章 ${$dd.text().replace(/.+章/,'').trim()}`,
								num: i,
								url: $dd.attr('href')
							})
							$item = $item.next('dd')
						}
						console.log(info, chapter)
						reslove({
							info: info,
							chapter
						})
					}
				});
		})
	},

	getChapter(url) {
		return new Promise((reslove, reject) => {
			superagent.get(`${config.BASE_URL}${url}`)
				.set({ 'User-Agent': agent[parseInt(Math.random() * agent.length)] })
				.set('X-Forwarded-For', '10.111.123.90')
				// .timeout({ response: 5000, deadline: 60000 })
				.charset('gbk')
				.end((err, res) => {
					console.log(`${config.BASE_URL}${url}`)
					if (err) {
						console.log(err)
						reject(err)
					} else {
						let $ = cheerio.load(res.text, {
							decodeEntities: false //禁用转码
						});
						let content = $('#content').html().replace(/<br>/g, '')
						content = content.replace(/https\:[\s\S]*/g, '')
						reslove( content + '\r')
					}
				})
		})
	},

	getText(url) {
		return new Promise((reslove, reject) => {
			superagent.get(config.BASEURL + url)
			//通过superagent去请求每一页
				.end(function(err, res) {
					if (err) {
						reject(err)
					} else {
						let $ = cheerio.load(res.text, {
							decodeEntities: false //禁用转码
						});
						reslove($('#content').html().replace(/<br><br>/g, '\r\n\n') + '\r\n\n')
					}
				});
		})

	}

}
