require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
app.use(express.json())
morgan.token('type' , (req) => JSON.stringify(req.body))
app.use(morgan(':method :status :url  :response-time ms :type'))
app.use(cors())
app.use(express.static('dist'))
// it is a middleWare that tells express to serve static files in dist folder as html, css & javascript

app.get('/info', (request, response) => {
  const time = new Date()
  Person.find({}).then(data => response.send(`<p>Phonebook has info for ${data.length} people</p><br/>${time}`))
})
app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(result => {
    response.json(result)
  }).catch(error => next(error))
})
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    person
      ? response.json(person)
      :response.status(404).end()
  }).catch(error => {
    next(error)
  })
})
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(() => response.status(204).end()).catch(error => next(error))
})
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const person = new Person(
    {
      name: body.name,
      number: body.number,
    }
  )
  body.name === undefined
    ? response.status(400).json({ error: 'content missing' })
    : person.save().then(savedPerson => response.json(savedPerson)).catch(error => next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new:true, runValidators: true, context: 'query' }).then(updatedData => {
    response.json(updatedData)
  }).catch(error => next(error))
})
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if(error.name === 'CastError'){
    return response.status(400).json({ error: 'malformed id' })
  } else if(error.name === 'ValidationError') {
    response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`app is runing at ${PORT}`)
})