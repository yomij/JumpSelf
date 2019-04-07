const fs = require('fs');
const path = require('path');
const config = require('../config').folderConfig;

const fmtTime = require('./fmtTime')

function getFileName() {
	let date = new Date();
	let time = date.getFullYear() + (date.getMonth() + 1 + '').padStart(2, 0) +  (date.getDate() + '').padStart(2, 0);
	let fileName = config.LOG_PATH + '\\' + time + '.log';
	return fileName;
}

module.exports = {
	makeDir(dir = '') {
		let p = config.ATL_PATH.split('/');
		let dirname = p.shift()
		if (fs.existsSync(path.join(config.ATL_PATH, dir))) {
			return
		}
		p.concat(dir.split('/')).forEach(item => {
			dirname = path.join(dirname, item);
			if (!fs.existsSync(dirname)) {
				fs.mkdirSync(dirname, err => {
					if (err) {
						console.log('文件夹创建失败', err);
					} else {
						console.log('文件夹创建成功');
					}
				})
			}
		})
	},
	writeJson(proxyArr, name) {
		let writeStream = fs.createWriteStream(`${__dirname}/${name}.json`);
		writeStream.on('finish', function(){
			console.log('Article Write Success');
		});
		writeStream.on('error', function(err){
			console.log('write error - %s', err.message);
		});
		writeStream.write(JSON.stringify(proxyArr));
		writeStream.end();
	},
	readJson(fileName) {
		const data = fs.readFileSync(`${__dirname}/${fileName}.json`,'utf-8');
		return JSON.parse(data)
	}
}
