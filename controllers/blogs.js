const router = require('express').Router()
const { Blog, User } = require('../models')
const { Op } = require('sequelize')
const { tokenExtractor } = require('../middleware/tokenExtractor')
const { sessionExtractor } = require('../middleware/sessionExtractor')

const blogFinder = async (req, res, next) => {
  try {
    req.blog = await Blog.findByPk(req.params.id)
    if (!req.blog) {
        return res.status(404).end()
    }
    next()
  } catch (error) {
    next(error)
  }
}

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${req.query.search}%`
        }
      },
      {
        author: {
          [Op.iLike]: `%${req.query.search}%`
        }
      }
    ]
  }

  const blogs = await Blog.findAll({
    order: [
      ['likes', 'DESC']
    ],
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, sessionExtractor, async (req, res, next) => {
  try {
    if (req.body.year && (req.body.year < 1991 || req.body.year > new Date().getFullYear())) {
      return res.status(400).json({
        error: `Year must be from 1991 to ${new Date().getFullYear()}`
      })
    }

    const blog = await Blog.create({...req.body, date: new Date(), userId: req.user.id})
    return res.status(201).json(blog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', tokenExtractor, sessionExtractor, blogFinder, async (req, res, next) => {
  try {
    if (req.blog.userId !== req.user.id) {
      return res.status(401).json({ error: 'unauthorized' })
    }
    await req.blog.destroy()
    return res.status(204).end()
  } catch (error) {
    next(error)
  }
})

router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } catch (error) {
    next(error)
  }
})

module.exports = router