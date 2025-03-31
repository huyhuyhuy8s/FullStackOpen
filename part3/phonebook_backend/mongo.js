const mongoose = require('mongoose')
const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.vn9klqq.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 5) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number);
    })
    mongoose.connection.close()
  })
  return;
}

const name = process.argv[3],
  number = process.argv[4];

const person = new Person({
  name: name,
  number: number,
})

// add new person to phonebook
person.save().then(result => {
  console.log(`added ${name} number ${number} to phonebook`)
  mongoose.connection.close()
})

// Note.find({}).then(result => {
//     result.forEach(note => {
//         console.log(note)
//     })
//     mongoose.connection.close()
// })
