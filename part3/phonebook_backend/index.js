const express = require('express')
const morgan = require('morgan');
const app = express();

// Middleware
const PORT = 3001
app.use(express.json())

morgan.token("body", (req) => JSON.stringify(req.body));

// Use Morgan with the custom token in the log format
app.use(
    morgan(`Server running on port ${PORT}\n:method :url :status :res[content-length] - :response-time ms" :body`)
);

let phonebook = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    if (phonebook) response.json(phonebook)
    else response.status(404).end()
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const data = phonebook.find(p => p.id === id)
    if (data) response.json(data)
    else response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebook = phonebook.filter(p => p.id !== id);
    response.status(204).end()
})

function genId() {
    // return String((phonebook.length > 0) ? Math.max(...phonebook.map(p => p.id)) + 1 : 0);
    return String(Math.floor(Math.random() * 100));
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!(body.name && body.number)) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (phonebook.find(p => p.name === body.name)) return response.status(400).json({ error: 'name must be unique' })

    const phone = {
        id: genId(),
        name: body.name,
        number: body.number,
    }

    phonebook = phonebook.concat(phone)

    response.json(phone)
})

app.get('/info', (request, response) => {
    const time = new Date().toString();
    const html = `<p>Phonebook has info for ${phonebook.length} people<p/>${time}`
    response.send(html);
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
