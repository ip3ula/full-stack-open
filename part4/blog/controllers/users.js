const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
    console.log('request.body', request.body)
    try {
        const { username, name, password } = request.body
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)
        const user = new User({ username, name, passwordHash })
        const savedUser = await user.save()
        response.json(savedUser)
    } catch (error) { next(error) }
})
usersRouter.get('/', async (request, response) => { 
    try {
        const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
response.json(users)
    } catch (error) { next(error) }
})

module.exports = usersRouter