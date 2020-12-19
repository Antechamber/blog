const express = require('express')
const router = new express.Router()
const Article = require('../models/article')
const User = require('../models/user')
const auth = require('../middleware/auth')


// home
router.get('/', async (req, res) => {
    res.render('index')
})

// create/sign up
router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', async (req, res) => {
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
router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})


// compose
router.get('/compose', auth, async (req, res) => {
    res.render('compose')
})

router.post('/compose', auth, async (req, res) => {
    const article = new Article({
        ...req.body,
        author: token
    })
    try {
        await article.save()
        res.send(201)
    } catch {
        res.send(400)
    }
})

module.exports = router