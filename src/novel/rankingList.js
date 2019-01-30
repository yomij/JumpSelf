
const superagent = require('superagent')
require('superagent-charset')(superagent)

const cheerio = require('cheerio');

const agent = require('./userAgent')
const config = require('../config').novelWebConfig

module.exports = {
	// 获取排行榜列表
	init() {
		return new Promise((reslove, reject) => {
			console.log(`${config.BASE_URL}${config.RANKING_URL}`)
			superagent.get(`${config.BASE_URL}${config.RANKING_URL}`)
				.charset('gbk')
				.set('X-Forwarded-For', '10.111.128.90')
				.end((err, res) => {
					if (err) {
						reject(err)
					} else {
						let $ = cheerio.load(res.text);
						const rankList = []
						$('.wrap.rank .block.bd').each((index, item) => {
							const $box = $(item)
							let rank = {
								rankName: $box.find('h2').text(),
								content: []
							}
							$box.find('ul li').each((index, item) => {
								rank.content.push({
									name: $(item).find('a').text(),
									url: $(item).find('a').attr('href')
								})
							})
							rankList.push(rank)
						})
						reslove(rankList)
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
	getBook(bookObj = {}) {
		return new Promise((reslove, reject) => {
			superagent.get(`${config.BASE_URL}${'/book/36242/'}`)
				.charset('gbk')
				.end((err, res) => {
					if (err) {
						console.log(err)
						reject(err)
					} else {
						let $ = cheerio.load(res.text, {
							decodeEntities: false //禁用转码
						})
						const $info = $('.book .info')
						let info = {
							mainImg: `${config.BASE_URL}${$info.find('.cover img').attr('src')}`,
							title: $info.find('h2').text()
						}
						let chapter = []
						const key = ['author', 'tags', 'status', 'totalWords', 'latestUpdate', 'latestChapter']
						$info.find('.small span').each((index, item) => {
							let val = ''
							if(item.children.length > 1) {
								val = item.children[1].children[0].data
							} else {
								val = item.children[0].data.split('：')[1]
							}
							info[key[index]] = val
						})
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
