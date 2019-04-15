// 封装console
(
	function (console) {
		let customizeFn = {
			error (str) {
				console.log("\033[31m " + str + " \033[0m")
			},
			info (str) {
				console.log("\033[36m " + str+ " \033[0m")
			},
			wran (str) {
				console.log("\033[43;37m " + str + " \033[0m")
			},
			success (str) {
				console.log("\033[32m " + str + " \033[0m")
			}
		}
		
		console = Object.assign(console, customizeFn)
	}
)(console)
