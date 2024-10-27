require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')
const app = express()



app.use(cors())

app.use(express.static('dist'))

app.use(express.json())

/* eslint-disable no-unused-vars */
morgan.token('body', function (req, _res) {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] :response-time ms :body')
)

app.get('/', (req, res) => {
  res.send('<h1>Welcom to Phonebook</h1>')
})

app.get('/info', async(req, res) => {
  const people = (await Contact.find({})).length
  const entries = people
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'Europe/Bucharest',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'long',
  })
  const htmlString = `<p>Phonebook has info for ${entries} people <br> ${timestamp} </p>`
  res.send(htmlString)
})


app.get('/api/persons', (req, res) => {
  Contact.find({}).then((contacts) => {
    res.json(contacts)
  })
})
app.post('/api/persons', (req, res, next) => {
  const newContact = new Contact({
    name: req.body.name,
    number: req.body.number,
  })

  newContact
    .save()
    .then((savedContact) => {
      res.json(savedContact)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  Contact.findById(id)
    .then((contact) => {
      if (contact) {
        res.json(contact)
      } else {
        res.status(404).end()
      }
    })
    .catch((err) => {
      next(err)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  const { id } = req.params
  Contact.findByIdAndDelete(id)
    .then((deletedContact) => {
      res.status(204).json(deletedContact)
    })
    .catch((err) => {
      next(err)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const { id } = req.params
  const person = {
    name: body.name,
    number: body.number,
  }
  Contact.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedContact) => {
      res.json(updatedContact)
    })
    .catch((error) => {
      next(error)
    })
})

const errorHandler = (err, req, res, next) => {
  console.log(`Error Name: ${err.name}`)
  console.log(`Error Details:${err.message}`)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'Misformatted Contact Id' })
  }
  if (err.name === 'ValidationError') {
    return res.status(400).send({ eror: err.message })
  }

  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('App running at 3001')
})
