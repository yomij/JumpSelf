const reserve = require('../novel/reserve')
const file = require('../utils/file')
const DB = require('../utils/dbConnect')

const Book = require('../db/book')
const Chapter = require('../db/chapter')

const COUNT = 5
const failedNum = []

async function testBook () {
	let book = await reserve.getBook()
}


testBook()

// getBreakpoint()
