const fs = require('fs');
const config = require('../config').folderConfig;

module.exports = {
	writeJson(proxyArr, name, path = 'P_PATH') {
		console.log(`${config[path]}/${name}.json`)
		let writeStream = fs.createWriteStream(`${config[path]}/${name}.json`);
		writeStream.on('finish', function(){
			console.log('Write Success');
		});
		writeStream.on('error', function(err){
			console.log('Write Error - %s', err.message);
		});
		writeStream.write(JSON.stringify(proxyArr));
		writeStream.end();
	},
	readJson(fileName, path = 'P_PATH') {
		const data = fs.readFileSync(`${config[path]}/${fileName}.json`,'utf-8');
		console.log(`${config[path]}/${fileName}.json`, data)
		return JSON.parse(data)
	},
	getNameByDay(date = new Date()) {
		return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
	}
}
