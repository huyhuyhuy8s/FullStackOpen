// ENV
require('dotenv').config()
const PORT = process.env.PORT
const express = require('express')
const app = express();
const morgan = require('morgan');

// Import models
const Person = require('./models/person')

// Assign Pre-con Middleware
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

// Middleware
app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

// Use Morgan with the custom token in the log format
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
    morgan(`Server running on port ${PORT}\n:method :url :status :res[content-length] - :response-time ms" :body`)
);


// Routes
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(person => {
            response.json(person);
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!(body.name && body.number)) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    Person.find({ name: body.name })
        .then(person => {
            if (person.length)
                return response.status(400).json({ error: "name must be unique" })
            else {
                const person = new Person({
                    name: body.name,
                    number: body.number,
                })

                person.save().then(savedPerson =>
                    response.json(savedPerson)
                )
            }
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body;

    if (!number)
        return response.status(400).json({ error: "number must be not null" })

    Person.findById(request.params.id)
        .then(person => {
            if (!person)
                return response.status(404).end()

            person.name = name
            person.number = number

            return person.save().then(updatedPerson =>
                response.json(updatedPerson)
            )
        })
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    const time = new Date().toString();
    Person.find({}).then(persons => {
        const html = `<p>Phonebook has info for ${persons.length} people<p/>${time}`
        response.send(html)
    })
})


// Assign handle Middleware
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError')
        return response.status(400).send({ error: 'malformated id' })

    next(error)
}

// Use handle Middleware
app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
