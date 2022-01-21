const express = require('express')
const router = new express.Router()
const User = require('../models/user')


// create/sign up
router.get('/users/signup', (req, res) => {
    res.render('signup')
})

router.post('/users/signup', async (req, res) => {
    // get new user info from req.body
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// login
router.get('/users/login', (req, res) => {
    res.render('login')
})

router.post('/users/login', async (req, res) => {
    try {
        // try to find user matching credentials provided through req.body
        const user = await User.findByCredentials(req.body.email, req.body.password)
        // generate auth token for logged in user and hand back to client to be stored as cookie
        // via login.js
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        // if User.findByCredentials fails to locate a User, then an error is thrown and status 400 sent back to client
        res.status(400).send()
    }
})

module.exports = router