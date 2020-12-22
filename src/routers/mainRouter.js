const express = require('express')
const router = new express.Router()
const Article = require('../models/article')
const User = require('../models/user')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')


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
        author: req.user._id
    })
    try {
        await article.save()
        res.sendStatus(201)
    } catch {
        res.sendStatus(400)
    }
})

// blog
router.get('/blog', (req, res) => {
    var page = 1
    var limit = 5
    if (req.query.page) {
        page = req.query.page
    }
    if (req.query.limit) {
        limit = req.query.limit
    }
    try {
        Article.paginate({}, {
            page,
            limit,
            sort: { 'createdAt': -1 }
        }).then((result) => {
            console.log(result)
            res.render('blog', result)
        })
    } catch {
        res.sendStatus(500)
    }
})

module.exports = router