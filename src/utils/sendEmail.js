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
		pass: 'llgajqrsjnubifga'
	},
	tls: {
		rejectUnauthorized: false
	}
});


module.exports = function send(title, artArr) {
console.log('aaa')
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
		if (item.problem) {
			mailOptions.html +=
				`<div>
					<div style='display: flex; align-items: center;font-size: 16px'>
						<img style="height: 60px;width: 60px; border-radius: 60px;margin-right: 20px" src='${item.avatarUrl}'/>
						<div>
							<p>${item.nickname}</p>
							<p>${item.id}</p>
						</div>
					</div>
					<p style='font-size: 16px'>${item.problem}</p>
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
