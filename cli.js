const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const { Blog, User, ReadList, Session } = require('./models')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readListRouter = require('./controllers/readList')
const logoutRouter = require('./controllers/logout')

// Error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return response.status(400).send({
      error: error.message
    })
  }

  if (error.name === 'SyntaxError') {
    return response.status(400).send({ error: 'Wrong request body' })
  } 

  next(error)
}

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readListRouter)
app.use('/api/logout', logoutRouter)
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

app.post('/api/reset', async (req, res) => {
  await Session.destroy({ where: {} })
  await ReadList.destroy({ where: {} })
  await Blog.destroy({ where: {} })
  await User.destroy({ where: {} })

  res.status(204).end()
})

app.get('/', (req, res) => {
  res.status(200).send('HTTP 200')
})

start()