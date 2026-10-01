const { ReadList } = require('../models')
const { tokenExtractor } = require('../middleware/tokenExtractor')
const { sessionExtractor } = require('../middleware/sessionExtractor')
const router = require('express').Router()

router.post('/', tokenExtractor, sessionExtractor, async (req, res, next) => {
  try {
    const readList = await ReadList.create(req.body)
    res.json(readList)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, sessionExtractor, async (req, res) => {
  const readListBlog = await ReadList.findOne({
    where: {
      id: req.params.id
    }
  })

  if (readListBlog.userId !== req.decodedToken.id) {
    return res.status(403).json({ error: 'unauthorized' })
  }

  if (readListBlog) {
    readListBlog.read = req.body.read
    await readListBlog.save()

    res.json(readListBlog)
  } else {
    res.status(404).end()
  }
})

module.exports = router