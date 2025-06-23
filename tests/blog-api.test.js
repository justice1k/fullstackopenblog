const {test, after, beforeEach} = require('node:test')
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

after(async () => {
  mongoose.connection.close()
})
// TODO: More tests from module