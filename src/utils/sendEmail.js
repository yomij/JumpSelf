const nodemailer = require('nodemailer');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

let transporter = nodemailer.createTransport({
	//https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
	service: 'qq',
	port: 465, // SMTP 端口
	secureConnection: true, // 使用 SSL
	ignoreTLS: true,
	auth: {
		user: '1130806423@qq.com',
		//这里密码不是qq密码，是你设置的smtp密码
		pass: 'xtkwcbzjvfrfjdjj'
	},
	tls: {
		rejectUnauthorized: false
	}
});


module.exports = function send(title, artArr) {

	if (!artArr.length) {
		return;
	}

	let mailOptions = {
		from: '1130806423@qq.com', // 发件地址
		to: 'yomi_Sheng@163.com', // 收件列表
		subject: title, // 标题
		//text和html两者只支持一种
		// text: '', // 内容
		html: '' // html 内容
	};

	artArr.forEach((item, index) => {
		if (item.title && item.content) {
			mailOptions.html +=
				`<div>
					<div style='display: flex'>
						<img src='${item.avatarUrl}'/>
						<h3>${item.id} ${item.nickname}</h3>
					</div>
					<p>${item.problem}</p>
				</div>`;
		}
	});

	return new Promise((reslove, reject) => {
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				// file.writeLog(mailOptions.subject + ' 发送失败');
				reject(console.log(error));
				// 写入
			}
			reslove("Eamil Sent Success.")
		});
	})


}
