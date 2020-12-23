const express = require('express')
const router = new express.Router()
const Article = require('../models/article')
const auth = require('../middleware/auth')
const mongoose = require('mongoose')

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
    if (req.query.article && mongoose.isValidObjectId(req.query.article)) {
        try {
            Article.paginate({ '_id': req.query.article }, {
                page,
                limit: 1,
                sort: { 'createdAt': -1 }
            }).then((result) => {
                res.render('blog', result)
            })
        } catch {
            res.sendStatus(500)
        }
    } else {
        try {
            Article.paginate({}, {
                page,
                limit,
                sort: { 'createdAt': -1 }
            }).then((result) => {
                res.render('blog', result)
            })
        } catch {
            res.sendStatus(500)
        }
    }
})

// compose
router.get('/blog/compose', auth, async (req, res) => {
    res.render('compose')
})

router.post('/blog/compose', auth, async (req, res) => {
    req.body.text = req.body.text.replace(/(?:\r\n|\r|\n)/g, '<br>')
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

module.exports = router