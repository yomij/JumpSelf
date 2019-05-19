const config = require('../config').dbConfig;

class DB {
	constructor(name = config.DB_NAME, port = config.DB_PROT) {

		this.mongoose = require('mongoose');
		this.mongoose.Promise = global.Promise;
		this.name = config.DB_NAME;
		this.port = port;
	}

	connect() {
		DB.connected[this.name];
		if (this.name in DB.connected) {
			return DB.connected[this.name];
		}

		console.log(`mongodb://${config.DB_HOST}:${this.port}/${this.name}`)
		const db = this.mongoose.createConnection(`mongodb://${config.DB_HOST}:${this.port}/${this.name}`, {useNewUrlParser: true});
		// 	const db = this.mongoose.createConnection('mongodb://yomi:HLJhp111@yomiyomi.mongodb.rds.aliyuncs.com:3717,dds-bp19c2233fd884642949-pub.mongodb.rds.aliyuncs.com:3717/yomi?replicaSet=mgset-15006431', {useNewUrlParser: true});
		DB.connected[this.name] = db;
		db.on('error', error => console.log('Database connect failed' + error));
		db.once('open', () => console.log("Database connect success,time:" + new Date().toLocaleString()));
		return db;
	}

	close() {
		if (this.name in DB.connected) {
			DB.connected[this.name].close(() => console.log('db closed'));
		} else {
			throw new Error('Database has not been connected');
		}
	}

	createSchema(schema, options) {
		return new this.mongoose.Schema(schema, options);
	}

	getMongoose() {
		return this.mongoose
	}

}

DB.connected = {};

module.exports = DB;
