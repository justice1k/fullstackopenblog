const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogRouter.get('/', (request, response) => {
    Blog.find({}).then(blogs => {
        response.json(blogs)
    })
})

blogRouter.get('/:id', (request, response) => {
    Blog.findById(request.params.id)
    .then(blog => {
        if(blog){
            response.json(blog)
        }else{
            response.status(404).end()
        }
    })
    .catch(error => logger.info(error.message))
})

blogRouter.post('/', (request, response) => {
    const body = request.body
    console.log(body)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.author,
    likes: body.likes
  })
  console.log(body.title)

  blog.save().then((result) => {
    response.status(201).json(result)
  }).catch(error => logger.error(error.message))
})

module.exports = blogRouter;