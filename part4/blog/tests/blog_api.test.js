const { test, after, beforeEach } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog.js')
const assert = require('node:assert')
const {MONGODB_URI} = require('../Utils/config')
let loggedInToken = ''
const url = process.env.MONGODB_URI
const bcrypt = require('bcrypt')
const User = require('../models/user')
const blogList = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({}) // Clear users

  // Create test user
  const passwordHash = await bcrypt.hash('paula200', 10)
  const user = new User({ username: 'ip3ula', passwordHash })
  await user.save()

  await Blog.insertMany(blogList)

  // Get a fresh token
  const response = await api.post('/api/login')
      .send({ username: "ip3ula", password: "paula200" })

  loggedInToken = response.body.token
})

mongoose.connect(url)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.log('Error connecting to MongoDB', error.message))

test('the saved blogs are returned as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.every(blog => blog.id), true)
})

test('a valid blog is added', async () => {
    const newBlog = {
        title: "How to make friends",
        author: "Mark",
        url: "http://friendship.com",
        likes: 120
    }

    await api.post('/api/blogs')
        .set('Authorization', `Bearer ${loggedInToken}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAfter = await api.get('/api/blogs')
    assert.strictEqual(blogsAfter.body.length, blogList.length + 1)
})

test('if no likes are added, default to 0', async () => {
    const newBlog = {
        title: "How to play basketball",
        author: "Mark",
        url: "http://basketball.com"
    }

    const response = await api.post('/api/blogs')
        .set('Authorization', `Bearer ${loggedInToken}`)
        .send(newBlog)
        .expect(201)

    assert.strictEqual(response.body.likes, 0)
})

test('if the title or url is missing, return 400', async () => {
    const newBlog = { author: "John" }

    await api.post('/api/blogs').set('Authorization', `Bearer ${loggedInToken}`)
        .send(newBlog)
        .expect(400)
})

test('the blog has been deleted', async () => {
    const blogAtStart = await Blog.find({})
    const blogToDelete = blogAtStart[1] // Get the second blog in the list

    await api.delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${loggedInToken}`)
        .expect(204) // Correct status code for successful deletion

    const blogsAfter = await api.get('/api/blogs')
    assert.strictEqual(blogsAfter.body.length, blogList.length - 1)
})

test('the blog likes has been updated', async () => {
    try {
    const blogs = await Blog.find({})
      const blogToUpdate = blogs[0]
      ;(await api.put('/api/blog/${blogToUpdate.id}')).send({ "likes": blogToUpdate.likes + 1})(200)
    } catch (error) {
      console.log('error', error)
    }
  })
  test('unathorized error 401', async () => {
    const newBlog = {
      title: "How to make friends",
      author: "paula",
      url: "http://friendship.com",
      likes: 120
    }
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(401)
  }
)
after(async () => {
    await mongoose.connection.close()
})
