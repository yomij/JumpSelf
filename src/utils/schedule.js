const schedule = require('node-schedule');
const recommend = require('./recommend')

const  similaritysSchedule = () => {
	//每分钟的第30秒定时执行一次:
	const prefs = {}
	recommend.getSimsList(prefs)
	schedule.scheduleJob('0 0 1 * * *', () => { // 一点整执行
		recommend.getSimsList(prefs)
	});
}

module.exports = {
	similaritysSchedule
}
