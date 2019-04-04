
class Socket {
	constructor (server, events = [], path = '/test') {
		const io = require('socket.io')(server, {
			path,
			serveClient: false,
			// below are engine.IO options
			pingInterval: 10000,
			pingTimeout: 5000,
			cookie: false
		});
		
		this.socket = io
		events.forEach(item => {
			this.register(item)
		})
		
		this.init()
	}
	init () {
		this.socket.on('connection',  (socket) => {
			console.log('Socket Connect Success');
		});
	}
	
	register (name) {
		if(this[name]) throw new Error('Socket: Event Name \'' + name + '\' Is Already Exist!')
		this[name] = (message) => this.socket.emit(name, message);
	}
	
	unload (name) {
		if (this[name]) this[name] = null;
	}
}

module.exports = Socket
