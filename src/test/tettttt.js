const superagent = require('superagent')
const cheerio = require('cheerio');
const fs = require('fs')

const config = {
	BASE: 'http://www.chery.cn',
	URL: 'http://www.chery.cn/vehicles/'
}

async function getHtml(href) {
	const res = await superagent.get(config.BASE + href)
	return res.text
}


async function getConfig(name) {
	console.log(config.URL + name)
	try {
		const res = await superagent.get(config.URL + name)
		const $ = cheerio.load(res.text);
		const $nav = $('#nav-configuration a')
		let configObject = {
			navs: [],
			index: $('.configuration-table .table-header').html()
		}
		const arr = Array.from($nav)
		for(let i = 0; i < arr.length; i++) {
			console.log($(arr[i]).text())
			const title = $(arr[i]).text()
			const url = $(arr[i]).attr('href')
			const key = url.split('/').pop().split('.').shift()
			configObject[key] = await getHtml(url)
			configObject.navs.push({
				title ,
				key,
			})
			
		}
		writeJson(configObject, name)
	} catch(e) {
		console.log(e.message)
	}
}

function writeJson(object, name) {
	let writeStream = fs.createWriteStream(`${__dirname}/${name}.json`);
	writeStream.on('finish', function(){
		console.log('Config Write Success');
	});
	writeStream.on('error', function(err){
		console.log('Write Error - %s', err.message);
	});
	writeStream.write(JSON.stringify(object));
	writeStream.end();
}

// getHtml("/assets/models/pc/configuration/arrizoGX/body.html")
getConfig('arrizoex')
