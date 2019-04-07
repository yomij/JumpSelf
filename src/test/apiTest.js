const bookDao = require('../db/book')

async function testSort() {
  console.log(await bookDao.getHeaterByTag('古典文学', 1))
}


async function testGetBook() {
  console.log(await bookDao.getBookById('5ca77996d5ef0526a8d8b0c3'))
}
testGetBook()