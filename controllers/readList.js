const { ReadList, Blog, User } = require('../models')
const { tokenExtractor } = require('../middleware/tokenExtractor')
const { sessionExtractor } = require('../middleware/sessionExtractor')
const router = require('express').Router()

router.post('/', async (req, res, next) => {
  try {
    const { blogId, userId } = req.body

    if (!blogId || !userId) {
      return res.status(400).json({
        error: 'blogId and userId are required'
      })
    }

    const blog = await Blog.findByPk(blogId)

    if (!blog) {
      return res.status(404).json({
        error: 'blog not found'
      })
    }

    const user = await User.findByPk(userId)

    if (!user) {
      return res.status(404).json({
        error: 'user not found'
      })
    }

    const existing = await ReadList.findOne({
      where: {
        blogId,
        userId
      }
    })

    if (existing) {
      return res.status(400).json({
        error: 'blog is already in reading list'
      })
    }

    const readList = await ReadList.create({
      blogId,
      userId,
      read: false
    })

    res.status(201).json({
      id: readList.id,
      blog_id: readList.blogId,
      user_id: readList.userId,
      read: readList.read
    })
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, sessionExtractor, async (req, res, next) => {
  try {
    const readListBlog = await ReadList.findByPk(req.params.id)

    if (!readListBlog) {
      return res.status(404).end()
    }

    if (readListBlog.userId !== req.user.id) {
      return res.status(401).json({
        error: 'unauthorized'
      })
    }

    readListBlog.read = req.body.read
    await readListBlog.save()

    res.json(readListBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = router