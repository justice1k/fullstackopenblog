require('express-async-errors')
const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
require('dotenv').config()

const app = express()
app.use(express.json());

mongoose
.connect(config.MONGO_URL)
.then(() => {
  logger.info("connected to DB")
})
.catch(error => logger.error("error connecting to DB", error.message))

app.use(middleware.requestLogger)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)


app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app

