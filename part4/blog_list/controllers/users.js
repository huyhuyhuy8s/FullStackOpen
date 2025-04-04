const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

usersRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updateUser = {
    username: body.username,
    name: body.name,
    passwordHash: await bcrypt.hash(body.password, 10)
  }

  const updatedUser = await User.findByIdAndUpdate(request.params.id, updateUser, { new: true })
  response.json(updatedUser)
})

module.exports = usersRouter
