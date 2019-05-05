// const nodemailer = require('nodemailer');
// const file = require('./file');
//
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
//
// let transporter = nodemailer.createTransport({
// 	//https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
// 	service: 'qq',
// 	port: 465, // SMTP 端口
// 	secureConnection: true, // 使用 SSL
// 	ignoreTLS: true,
// 	auth: {
// 		user: '1130806423@qq.com',
// 		//这里密码不是qq密码，是你设置的smtp密码
// 		pass: 'xtkwcbzjvfrfjdjj'
// 	},
// 	tls: {
// 		rejectUnauthorized: false
// 	}
// });
//
//
// module.exports = function send(artArr) {
//
// 	if (!artArr.length) {
// 		return;
// 	}
//
// 	let mailOptions = {
// 		from: '1130806423@qq.com', // 发件地址
// 		to: 'yomi_Sheng@163.com', // 收件列表
// 		subject: '', // 标题
// 		//text和html两者只支持一种
// 		text: '', // 内容
// 		// html: '<b>Hello world ?</b>' // html 内容
// 	};
//
// 	console.log('Ready To Sent Eamil.');
//
// 	artArr.forEach((item, index) => {
// 		if (item.title && item.content) {
// 			console.log(`Send content ${ index + 1 } title = ${ item.title }, content length = ${ item.content.length } `)
// 			mailOptions.subject += item.title;
// 			mailOptions.text += item.content;
// 		} else {
// 			mailOptions.subject += new Error('title is empty');
// 			mailOptions.text += new Error('content is empty');
// 		}
//
// 	});
//
// 	return new Promise((reslove, reject) => {
// 		transporter.sendMail(mailOptions, function (error, info) {
// 			if (error) {
// 				file.writeLog(mailOptions.subject + ' 发送失败');
// 				reject(console.log(error));
// 			}
// 			file.writeArticle(mailOptions.subject, mailOptions.text);
// 			file.writeLog(mailOptions.subject + ' 字数：' + mailOptions.text.length + ' 发送成功');
// 			reslove("Eamil Sent Success, Waiting For Next Query ... ... ...")
// 		});
// 	})
//
//
// }
