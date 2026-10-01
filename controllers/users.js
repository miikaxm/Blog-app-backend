const router = require('express').Router()
const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: {
      exclude: ['password']
    },
    include: {
      model: Blog,
      attributes: {
        exclude: ['userId']
      }
    }
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res) => {
  const { read } = req.query
  const user = await User.findByPk(req.params.id, {
    attributes: {
      exclude: ['password']
    },
    include:[{
      model: Blog,
      attributes: { exclude: ['userId'] }
    },
    {
      model: Blog,
      as: 'reading_list',
      attributes: { exclude: ['userId']},
      through: {
        attributes: ['read', 'id'],
        ...(read !== undefined && {
          where: {
            read: read === 'true'
          }
        })
      }
    }
  ]
  })

  if (!user) {
    return res.status(404).end()
  }

  const userJson = user.toJSON()

  userJson.readings = userJson.reading_list.map(blog => ({
    ...blog,
    reading_list: blog.read_list
  }))

  delete userJson.reading_list

  res.json(userJson)
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (user) {
    user.name = req.body.name
    await user.save()

    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router