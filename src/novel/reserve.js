const superagent = require('superagent')
require('superagent-charset')(superagent)
const cheerio = require('cheerio');
const agent = require('./userAgent')

const config = {
	SEARCH_URL: 'https://www.ixdzs.com/bsearch?q=a',
	BASE_URL: 'https://www.ixdzs.com',
	CHAPTER_URL: 'https://read.ixdzs.com'
}

const format = {
	'作者': {
		key: 'author',
		format: null,
	},
	'字数': {
		key: 'totalCount',
		format(text) {
			const rules = {
				'十': 10,
				'百': 100,
				'千': 1000,
				'万': 10000,
			}
			const testArr = Array.from(text)
			let num = text.match(/^([0-9]+(\.\d+)?)|(0\.\d+)$/g)[0] || 1
			testArr.forEach(item => {
				if (~~item <= 0) {
					const f = rules[item]
					if (f) num *= f
				}
			})
			return num
		}
	},
	'状态': {
		key: 'status',
		format(text) {
			return ~~/^连载/g.test(text) || ~~/^更新到/g.test(text)
		}
	},
	'最新章节': {
		key: 'latestUpdate',
		format: null
	},
	'最新': {
		key: 'latestUpdateName',
		format: null
	},
	'时间': {
		key: 'latestUpdate',
		format: null
	},
	'分类': {
		key: 'mainTag'
	}
}

module.exports = {
	// 获取排行榜列表
	init(res) {
		return new Promise((reslove, reject) => {
			console.log(`${config.SEARCH_URL}`)
			superagent.get(`${config.SEARCH_URL}`)
				.charset('utf-8')
				.set('X-Forwarded-For', '10.111.128.90')
				.end((err, res) => {
					if (err) {
						reject(err)
					} else {
						let books = []
						let $ = cheerio.load(res.text);
						$('.box_k ul li').each((index, item) => {
							let book = {}
							item = $(item)
							book = Object.assign({
								title: item.find('.b_name').text(),
								mainImg: item.find('.list_img img').attr('src'),
								description: item.find('.b_intro').text().replace(/\s*|\t|\r|\n|/g, ''),
								extra: {
									mainUrl: config.BASE_URL + item.find('.list_img a').attr('href')
								}
							})
							item.find('.b_info span').each((i, info) => {
								let list = $(info).text().split('：')
								let text
								if (i === 3) {
									text = $(info).find('i').text()
								} else {
									text = list[1]
								}
								book[format[list[0]].key] = format[list[0]] && format[list[0]].format ? format[list[0]].format(text) : text
							})
							books[index] = book
						})
						reslove(books)
					}
				});
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
	getBook(url = 'https://www.ixdzs.com/d/64/64960/') {
		console.log(url)
		return new Promise((reslove, reject) => {
			superagent.get(url)
				.end((err, res) => {
					if (err) {
						console.log(err)
						reject(err)
					} else {
						let $ = cheerio.load(res.text, {
							decodeEntities: false //禁用转码
						})
						let book = {}
						const infoBox = $('.d_info')
						infoBox.find('ul li').each((i, item) => {
							let list
							list = $(item).text().split('：')
							if (i === 2) {
								book['heat'] = format['字数'].format(list[2] || 1)
							}
							if(list.length > 1) {
								let text = list[1]
								book[format[list[0]].key] = format[list[0]] && format[list[0]].format ? format[list[0]].format(text) : text
							} else {
								book['chapterUrl'] = $(item).find('a').eq(1).attr('href')
							}
						})
						reslove(book)
					}
				});
		})
	},
	
	getChapters(url = 'https://read.ixdzs.com/213/213028/') {
		console.log(url)
		return new Promise((reslove, reject) => {
			superagent.get(url)
				.end((err, res) => {
					if (err) {
						console.log(err)
						reject(err)
					} else {
						let $ = cheerio.load(res.text, {
							decodeEntities: false //禁用转码
						})
						const chapters = []
						$('.catalog a').each((i, item) => {
							item = $(item)
							let chapter = {
								chapterNum: i,
								title: item.text(),
								source: url + $(item).attr('href'),
								wordCount: $(item).attr('title').split(':')[1] || 0
							}
							chapters.push(chapter)
						})
						reslove(chapters)
					}
				});
		})
	},
	
	getChapter(url = 'https://read.ixdzs.com/213/213028/p54.html') {
		return new Promise((reslove, reject) => {
			superagent.get(url)
				.set({'User-Agent': agent[parseInt(Math.random() * agent.length)]})
				.set('X-Forwarded-For', '10.111.123.90')
				.end((err, res) => {
					console.log(`${config.BASE_URL}${url}`)
					if (err) {
						console.log(err)
						reject(err)
					} else {
						let $ = cheerio.load(res.text, {
							decodeEntities: false //禁用转码
						});
						let content = $('.content').html() && $('.content').html().replace(/\n/g, '')
						// content = content.replace(/https\:[\s\S]*/g, '')
						reslove(content)
					}
				})
		})
	},
	
	getText(url) {
		return new Promise((reslove, reject) => {
			superagent.get(config.BASEURL + url)
				//通过superagent去请求每一页
				.end(function (err, res) {
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
