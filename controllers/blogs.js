const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if(blog){
        response.json(blog)
    }else{
        response.status(404).end()
    }
})

blogRouter.post('/', async (request, response) => {
    const body = request.body
    const user = await User.findById(process.env.USER_ID)

    if(!user){
        return response.status(400).json({error: "UserId not found"})
    }

    const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const newBlog = request.body

    const oldBlog = await Blog.findById(request.params.id)
    if(oldBlog){
        const updatedBlog = new Blog(oldBlog)
        updatedBlog.title = newBlog.title
        updatedBlog.author = newBlog.author
        updatedBlog.url = newBlog.url
        updatedBlog.likes = newBlog.likes

        const result = await updatedBlog.save()
        response.status(200).json(result)
    }else{
        response.status(404).end()
    }


})

module.exports = blogRouter;