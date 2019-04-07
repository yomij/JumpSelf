const Router = require('koa-router')();
const book = require('./book');
const login = require('./login');
const chapter = require('./chapter')

Router.use(book.routes());
Router.use(login.routes());
Router.use(chapter.routes());

module.exports = Router;
