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
  

  app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
  })

 app.get('/info', (request, response) => {
    const maxID = persons.length
    const message = `Phonebook has info for ${maxID} people`
    const timeOfRequest = new Date()

    response.send(`<h1>${message}</h1><p>${timeOfRequest}</p>`)
  
 })
  
 app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
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
})

function getRandomID(){
  const max = 10000
  const min = 10

  const randomID = Math.random() * (max - min) + min;
  return Math.round(randomID)
}
  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})