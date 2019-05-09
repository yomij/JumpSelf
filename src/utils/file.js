const fs = require('fs');
const config = require('../config').folderConfig;

module.exports = {
	writeJson(proxyArr, name, path = 'P_PATH') {
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
	readJson(fileName) {
		const data = fs.readFileSync(`${config.P_PATH}/${fileName}.json`,'utf-8');
		return JSON.parse(data)
	}
}
