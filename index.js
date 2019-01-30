const send = require('./src/sendEmail');
const fetch = require('./src/getData');
const file = require('./src/file');

const fmtTime = require('./src/fmtTime');
let queryTimes = 0;

function GetRandomNum(Min, Max) {
	let Range = Max - Min;
    let Rand = Math.random();
	return (Min + Math.round(Rand * Range)) * 60 * 1000;
}

async function getArticle() {

	console.log('\n\n\nQueryTimes = ' +  ++queryTimes + fmtTime('yyyy-MM-dd hh:mm:ss') + '\n');

	let artList = await fetch.getChapterText();

	console.log('Get ArtList Success, Update Counts  = ' + artList.length);


	if(artList.length > 0){

		for(let i = 0; i < artList.length; i++) {

			let content = await fetch.getText(artList[i].url);
			artList[i].content = content;

		}

		console.log(await send(artList));
	}

}

function delay() {
	let time = GetRandomNum(20, 40)
	console.log(time)
	delay.timeout = setTimeout(() => {
		getArticle();
		clearTimeout(delay.timeout)
		delay()
	}, time)
}

delay.timeout = 0

fetch.init().then((inf)=> {

	console.log(inf);

	getArticle();

	delay()


})
