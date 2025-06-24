const Blog = require('../models/blog')

const initialBlogs = [
    {
        "title": "My First Blog Post",
        "author": "John Doe",
        "url": "https://example.com/my-first-blog-post",
        "likes": 42,
    },
    {
        "title": "My Second Blog Post",
        "author": "Janny Doe",
        "url": "https://example.com/my-second-blog-post",
        "likes": 11,
    },
]

const oneBlog = 
  {
  "title": "My 5th Blog Post",
  "author": "Justine Akpalu",
  "url": "https://example.com/my-5th-blog-post",
  "likes": 200
}

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const firstBlog = async () => {
  const blogs = await blogsInDB()
  return blogs[0]
}
module.exports = {
  initialBlogs,
  oneBlog,
  blogsInDB,
  firstBlog,
};