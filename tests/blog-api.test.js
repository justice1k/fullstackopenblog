const {test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)
const listHelper = require('../utils/list_helper')



beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('DB cleared')
  const blogObjects = listHelper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
  console.log('test DB initialized...')
})

test('blogs are returned as json', async () => {
  await api
  .get('/api/blogs')
  .expect(200)
  .expect('Content-Type', /application\/json/)

})

test('number of blogs as expected', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 2)
})

test('unique identifier is id not _id', async () => {
  const res = await api.get('/api/blogs')
  assert.strictEqual(res.body[0].hasOwnProperty('id'), true)
})


describe('adding a new blog', () => {
  test('new blog successfully added', async () => {
    await api.post('/api/blogs')
    .send(listHelper.oneBlog)
    .expect(201)

    const blogsAtEnd = await listHelper.blogsInDB()
    const blogs = blogsAtEnd.map(blog => blog.title)
    assert.strictEqual(blogsAtEnd.length, listHelper.initialBlogs.length + 1)
    assert(blogs.includes('My 5th Blog Post'))
  })

  describe('deleting a blog',() => {
    test('appropriate status code', async () => {
      await api.delete('/api/blogs/6859ae25285f8121bfe9bf39')
      .expect(204)

      const blogsAtEnd = await listHelper.blogsInDB()
      assert.deepEqual(blogsAtEnd.length, 2)
    })
  })

  describe('updating a blog', () => {
    test('first blog\'s likes is equal to 6000', async () => {
        const firstBlog = await listHelper.firstBlog()
        const updateData = {
          title: firstBlog.title,
          author: firstBlog.author,
          url: firstBlog.url,
          likes: 6000,
        }
        await api.put(`/api/blogs/${firstBlog.id}`)
        .send(updateData)
        .expect(200)

        const result = await api.get(`/api/blogs/${firstBlog.id}`)

        assert.strictEqual(result.body.likes, 6000)
    } )
  })


})
after(async () => {
  mongoose.connection.close()
})
// TODO: More tests from module