const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { response } = require('express')

usersRouter.post('/', async (request, response) => {
    const {username, name, password} = request.body

    if(password.length < 3){
        return response.status(400).json({error: 'Password must be more than 3 characters long'})
    }


    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username: username,
        name: name,
        passwordHash: passwordHash,
        // blogs: []
    })

    const savedUser = await user.save()

    response.status(201).send(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users)
})


module.exports = usersRouter;