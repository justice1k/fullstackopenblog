const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')

    console.log(authorization)
    if(authorization && authorization.startsWith('Bearer ')){
        console.log(authorization.replace('Bearer ', ''))
        return authorization.replace('Bearer ', '')
    }

    return null
}

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

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if(!decodedToken.id){
        return response.status(401).send({error: 'token invalid'})
    }
    const user = await User.findById(decodedToken.id)

    if(!user){
        return response.status(400).json({error: "UserId missing or not valid"})
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

// TODO: Add authentication to remaining endpoints
module.exports = blogRouter;