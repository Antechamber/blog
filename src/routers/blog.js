const express = require('express')
const router = new express.Router()
const Article = require('../models/article')
const auth = require('../middleware/auth')
const mongoose = require('mongoose')

// blog
router.get('/blog', (req, res) => {
    var page = 1
    var limit = 5
    // if page or limit are part of request (url string) then save that variable in router scope
    if (req.query.page) {
        page = req.query.page
    }
    if (req.query.limit) {
        limit = req.query.limit
    }
    // if article id specified
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

// update
router.patch('/blog/compose', auth, async (req, res) => {
    // get array of requested updates
    const updates = Object.keys(req.body)
    console.log(updates)
    // array of accepted updates
    const allowedUpdates = ['title', 'text']
    // use array.every to check that callback function returns true for every array element
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    // if any updates are not in allowedUpdates, return error and status code 400 (bad request)
    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const article = await Article.findOne({ _id: req.query.article })
        if (!article) {
            return res.status(404).send()
        }
        // loop through updates array and apply all updates to user
        req.body.text = req.body.text.replace(/(?:\r\n|\r|\n)/g, '<br>')
        updates.forEach((update) => article[update] = req.body[update])
        // asyncronously save user
        console.log('saving')
        await article.save()
        console.log('saved')
        res.sendStatus(200)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/blog/updatearticle', auth, async (req, res) => {
    const htmlToPlainText = (html) => {
        html = html.replace(/<style([\s\S]*?)<\/style>/gi, '');
        html = html.replace(/<script([\s\S]*?)<\/script>/gi, '');
        html = html.replace(/<\/div>/ig, '\n');
        html = html.replace(/<\/li>/ig, '\n');
        html = html.replace(/<li>/ig, '  *  ');
        html = html.replace(/<\/ul>/ig, '\n');
        html = html.replace(/<\/p>/ig, '\n');
        html = html.replace(/<br\s*[\/]?>/gi, "\n");
        html = html.replace(/<[^>]+>/ig, '');
        return html
    }

    if (req.query.article && mongoose.isValidObjectId(req.query.article)) {
        try {
            Article.paginate({ '_id': req.query.article }, {
                limit: 1
            }).then((result) => {
                result.docs[0].text = htmlToPlainText(result.docs[0].text)
                res.render('updateArticle', result.docs[0])
            })
        } catch {
            res.status(500).send()
        }
    } else {
        res.status(400).send()
    }
})

module.exports = router