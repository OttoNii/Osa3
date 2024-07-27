const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
      id: "1",
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: "2",
      name: "Ada Lovelace",
      number: "39-55-5323523"
    },
    {
      id: "3",
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: "4",
      name: "Mary Poppendieck",
      number: "39-23-6423122"
    }
  ]
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

 app.get('/info', (request, response) => {
    const maxID = persons.length
    const message = `Phonebook has info for ${maxID} people`
    const timeOfRequest = new Date()

    response.send(`<h1>${message}</h1><p>${timeOfRequest}</p>`)
  
 })
  
 app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  const person = {
    id: getRandomID(),
    name: body.name,
    number: body.number,
  }
  
  persons = persons.concat(person)

  response.json(person)
})

function getRandomID(){
  const max = 10000
  const min = 10

  const randomID = Math.random() * (max - min) + min;
  return Math.round(randomID)
}
  
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)