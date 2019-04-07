const Router = require('koa-router')();
const book = require('./book');

Router.use(book.routes());

module.exports = Router;

