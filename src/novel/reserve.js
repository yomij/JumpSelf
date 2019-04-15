const superagent = require('superagent')
require('superagent-charset')(superagent)
require('superagent-proxy')(superagent)

const cheerio = require('cheerio');
const agent = require('../utils/userAgent')

const config = require('../config').novelWebConfig

const userAgents = require('../utils/userAgent')

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
		format(text) {
			if (/^\d+小时/g.test(text)) {
				const hours = text.match(/^\d+/g)[0]
				return new Date().getTime() - hours * 60 * 60 * 1000
			}
		}
	},
	'最新': {
		key: 'latestUpdateName',
		format: null
	},
	'时间': {
		key: 'latestUpdate',
		format(text) {
			if (/^\d+小时/g.test(text)) {
				const hours = text.match(/^\d+/g)[0]
				return new Date().getTime() - hours * 60 * 60 * 1000
			}
		}
	},
	'分类': {
		key: 'mainTag'
	}
}





async function getProxy() {
	const res = await superagent
		.get('http://piping.mogumiao.com/proxy/api/get_ip_bs?appKey=fe2b66789efc4695aff3ac5104672a30&count=1&expiryDate=0&format=1&newLine=2')
	const data = JSON.parse(res.text)
	console.log(res.text)
	if (data.code === 0) {
		console.log('http://' + +data.msg[0].ip + ':'+  data.msg[0].port)
	}
}
// getProxy()


module.exports = {
	// 获取排行榜列表
	search(text) {
		return new Promise((resolve, reject) => {
			console.log(`${config.SEARCH_URL}${text}`)
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
						resolve(books)
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
	async getBook(url, useIp) {
		// console.log('getBook', url, 'http://' + useIp)
		return new Promise((resolve, reject) => {
			superagent.get(config.BASE_URL + url)
				.set('X-Forwarded-For', '10.131.128.90')
				.set('header', {
					'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
					'Accept-Encoding': 'gzip, deflate',
					'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
					'User-Agent': userAgents[~~(userAgents.length * Math.random())],
				})
				// .proxy('http://' + useIp)
				.timeout(config.TIMEOUT * 3)
				.end((err, res) => {
					if (err) {
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
						book = Object.assign(book,{
							title: infoBox.find('h1').text().split('txt')[0],
							mainImg: {
								url: $('.d_af img').attr('src')
							},
							description: $('.d_co').text().replace(/\s*|\t|\r|\n|/g, ''),
							extra: {
								urls: {
									mainUrl: config.BASE_URL + url
								}
							}
						})
						resolve(book)
					}
				});
		})
	},

	testProxy(url , ip) {
		return new Promise((resolve, reject) => {
			superagent.get(config.BASE_URL + url)
				.proxy(`http://${ip}`)
				.timeout(config.TIMEOUT * 3)
				.end((err, res) => {
					if (err) {
						reject(err)
					} else if (res.text){
						resolve(ip)
					} else {
						reject()
					}
				});
		})
	},
	
	getChapters(url) {
		return new Promise((resolve, reject) => {
			superagent.get(url)
				.set('header', {
					'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
					'Accept-Encoding': 'gzip, deflate',
					'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
					'User-Agent': userAgents[~~(userAgents.length * Math.random())],
				})
				.end((err, res) => {
					if (err) {
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
						resolve(chapters)
					}
				});
		})
	},
	
	getChapter(url) {
		return new Promise((reslove, reject) => {
			superagent.get(url)
				.set({'User-Agent': userAgents[parseInt(Math.random() * agent.length)]})
				.set('X-Forwarded-For', '10.111.123.90')
				// .proxy(proxy)
				.timeout(config.TIMEOUT)
				.end((err, res) => {
					console.log(`${url}`)
					if (err) {
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

	getChapterM(id, chapterNum) {
		return new Promise((reslove, reject) => {
			const url = `${config.CHAPTER_URL_M}/${id}/p${chapterNum}.html`
			console.log(url, id, chapterNum)
			superagent.get(url)
				.set({'User-Agent': userAgents[parseInt(Math.random() * agent.length)]})
				.set('X-Forwarded-For', '10.111.123.90')
				// .proxy(proxy)
				.timeout(config.TIMEOUT)
				.end((err, res) => {
					if (err) {
						console.log(err)
						reject(err)
					} else {
						let $ = cheerio.load(res.text, {
							decodeEntities: false //禁用转码
						});
						let content =  $('.page-content section').html().replace(/\n/g, '').replace(/^\s+|\s+$/g, '')
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
