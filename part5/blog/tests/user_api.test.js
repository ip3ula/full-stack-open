const { test, after, beforeEach } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user.js')
const url = process.env.TEST_MONGODB_URI
const assert = require('node:assert')

beforeEach(async () => {
  await User.deleteMany({})
})
mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log('Error connecting to MongoDB', error.message))
  test('invalid user is not added', async () => {
    try {
        const newUser = {
            username: "a",
            name: "Mark",
            password: "123"
          }
          
          const response = await api.post('/api/users')
            .send(newUser)
            .expect(400)
    } catch (error) {
      console.log('Error adding invalid user', error.message)
    }
  })
  after( async () => {
  await mongoose.connection.close()
})