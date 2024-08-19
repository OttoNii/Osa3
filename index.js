require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT
const Person = require('./models/person')



app.use(express.static('dist'))


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}



let persons = [
  ]

  app.use(cors())
  app.use(express.json())
  app.use(requestLogger)


  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  

  app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
  })

 app.get('/info', (request, response) => {
    const maxID = persons.length
    const message = `Phonebook has info for ${maxID} people`
    const timeOfRequest = new Date()

    response.send(`<h1>${message}</h1><p>${timeOfRequest}</p>`)
  
 })
  
 app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  /*if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }*/

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})