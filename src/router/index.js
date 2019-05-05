const Router = require('koa-router')();
const book = require('./book');
const login = require('./login');
const chapter = require('./chapter')
const user = require('./user')
const comment = require('./comment')
const behavior = require('./behavior')

Router.use(book.routes());
Router.use(login.routes());
Router.use(chapter.routes());
Router.use(user.routes());
Router.use(comment.routes())
Router.use(behavior.routes())

module.exports = Router;
