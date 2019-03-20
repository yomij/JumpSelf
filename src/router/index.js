const Router = require('koa-router')();
const book = require('./photograph');
const login = require('./login');


Router.use(book.routes());
Router.use(login.routes());

module.exports = Router;
