const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 3001


app.use(express.static('backend'))

morgan.token('post-data', (req) => {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}


let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-55-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: 4,
      name: "Mary Poppendieck",
      number: "39-23-6423122"
    }
  ]

  app.use(cors())
  app.use(express.json())
  app.use(requestLogger)


  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  

  app.get('/persons', (request, response) => {
    response.json(persons)
  })

 app.get('/info', (request, response) => {
    const maxID = persons.length
    const message = `Phonebook has info for ${maxID} people`
    const timeOfRequest = new Date()

    response.send(`<h1>${message}</h1><p>${timeOfRequest}</p>`)
  
 })
  
 app.get('/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  const nameExists = persons.some(person => person.name === body.name);
  if (nameExists) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    });
  }
  
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
  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})