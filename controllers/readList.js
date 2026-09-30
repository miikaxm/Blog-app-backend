const { ReadList } = require('../models')

const router = require('express').Router()

router.post('/', async (req, res, next) => {
  try {
    const readList = await ReadList.create(req.body)
    res.json(readList)
  } catch (error) {
    next(error)
  }
})

module.exports = router