	const superagent = require('superagent');
// let rp = require("request-promise");
const cheerio = require('cheerio');


const config = {
	BASEURL: 'https://www.dingdiann.com', // 顶点
	chapter: 0,
};

module.exports = {
		init() {
			return new Promise((reslove, reject) => {
				if(config.chapter > 0){
					reslove('Now Chapter = ' + config.chapter)
				}
				superagent.get(config.BASEURL + '/ddk74633/')
				.set('X-Forwarded-For', '10.111.198.90')
					//通过superagent去请求每一页
					.end(function(err, res) {
						if (err) {
							return console.error(err)
						} else {
							let $ = cheerio.load(res.text);

							if (config.chapter === 0) {
								let latestText = $('#info p').eq(3).text(); //设置最新章节
								config.chapter = +latestText.match(/\d+/i)[0] - 1;
								reslove('Init Success, Now Chapter = ' + config.chapter);
							}
						}
					});
			})


		},

		getChapterText(nowChapter) { //获得最新更新的章节

			return new Promise((reslove, reject) => {
				superagent.get(config.BASEURL + '/ddk74633/')
					.end(function(err, res) {
						if (err) {
							reject(err)
						} else {
							let $ = cheerio.load(res.text);
							let list = Array.from($('#list dd')).splice(0, 5);
							let latestChapter = $(list[0]).find('a').text().match(/\d+/i)[0]; //章节
							// that.getText($(list[0]).find('a').attr('href'))
							if(latestChapter === config.chapter) {
								reslove([])
							}
							list.reverse()
							list = list.map(item => {
								let $a = $(item).find('a');

								if ($a.text().match(/\d+/i)[0] > config.chapter) {
									// console.log($a.attr('href'));
									return {
										title: $a.text(),
										url: $a.attr('href')
									}
								} else {
									return 0
								}
							})
							console.log(list)
							config.chapter = latestChapter;
							console.log(latestChapter)
							console.log('Update Chapter Success, Now Chapter = ' + config.chapter);
							reslove(list.filter(i => i))
						}
					});
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
