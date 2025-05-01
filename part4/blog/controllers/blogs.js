const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../Utils/config');

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs =  await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) { next(error) }
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const Id = request.params.id
  const blog = await Blog.findById(Id)
  response.json(blog)
  } catch (error) { next(error) }
  
})
blogsRouter.post('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const body = request.body
    const user = request.user
    if (body.title === undefined || body.url === undefined || body.author === undefined) {
      return response.status(400).json({ error: 'content is missing' })
    }
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id 
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})
blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    if (!request.token) {
      return response.status(401).json({ error: 'token missing' })
    }

    const decodedToken = jwt.verify(request.token, SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'invalid token' })
    }

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})
blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const id = request.params.id;
    const body = request.body;

    if (!body.title || !body.author || !body.url) {
      return response.status(400).json({ error: 'Missing required fields' });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { 
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
      },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' });
    }

    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});
module.exports = blogsRouter