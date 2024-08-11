const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]


const url =
  `mongodb+srv://Otto:${password}@cluster0.qgrwp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  Name: String,
  Number: String,
})

const Person = mongoose.model('Person', personSchema)


const saveNew = (name, number) => {
  const person = new Person({
  Name: name,
  Number: number,
})
person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})
}


if (process.argv.length>3){
  saveNew(name, number)
}
else{
  Person.find({}).then(result => {
  console.log('Phonebook:')
  result.forEach(person => {
    console.log(person.Name, person.Number)
  })
  mongoose.connection.close()
})
}








