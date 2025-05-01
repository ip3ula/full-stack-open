const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

// Import middleware
const { morganMiddleware, errorHandler, tokenExtractor, userExtractor } = require('./Utils/mildware.js')

// Import routes
const blogsRouter = require('./controllers/blogs.js')
console.log(blogsRouter)

// MongoDB connection
const { MONGODB_URL, PORT } = require('./Utils/config.js')
const mongoUrl = MONGODB_URL
console.log('connecting to', mongoUrl)
mongoose.connect(mongoUrl)
  .then(() => console.log('connected to mongoose'))
  .catch(error => console.log('error connecting to mongoose', error.message))

// Apply middleware before routes
app.use(express.json())
app.use(cors())
app.use(morganMiddleware)
app.use(tokenExtractor)

// Routes
app.use('/api/blogs', userExtractor, blogsRouter)
app.use('/api/users', require('./controllers/users.js')) // Commented out
app.use('/api/login', require('./controllers/login.js')) // Commented out

// Error handling middleware should be applied last
app.use(errorHandler)
module.exports = app
