const novelWebConfig = require('./novelWebSiteConfig')
const dbConfig = require('./dbConfig')
const folderConfig = require('./folderConfig')
const WXConfig = require('./WXConfig')

module.exports =  {
	APP_PORT: 3000,
	SECRET: 'YOMI',
	novelWebConfig,
	dbConfig,
	folderConfig,
	WXConfig
}
