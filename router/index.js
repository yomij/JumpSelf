const Router = require('koa-router')();
const book = require('./photograph');


Router.use(book.routes());

module.exports = Router;
