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
	writeLog(log = '') {
		fs.appendFile(getFileName(), `\n\r[${fmtTime('yyyy-MM-dd hh:mm:ss')}] ${log} \n\r`, (err) => {
			if (err) throw err;
			console.log('Log Write Success');
		});
	},
	writeArticle(title = 'article', content = '') {
		let writeStream = fs.createWriteStream(`${config.ATL_PATH}/[${fmtTime('yyyy-MM-dd')}] ${title}.txt`);
		writeStream.on('finish', function(){
			console.log('Article Write Success');
		});
		writeStream.on('error', function(err){
			console.log('write error - %s', err.message);
		});
		writeStream.write(title + '\n\r' + content + '\n\r', 'utf8');
		writeStream.end();
	}
}
