const express = require('express')
const router = new express.Router()
const Article = require('../models/article')
const auth = require('../middleware/auth')
const mongoose = require('mongoose')

// blog
router.get('/blog', (req, res) => {
    var page = 1
    var limit = 5
    // if page or limit are part of request.query (after '?' in url) then save that variable in router scope
    if (req.query.page) {
        page = req.query.page
    }
    if (req.query.limit) {
        limit = req.query.limit
    }
    // if article id specified
    if (req.query.article && mongoose.isValidObjectId(req.query.article)) {
        // generate first 1 (limit) articles with matching '_id' property, sorted descending by createdAt
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
            // generate first article sorted descending by 'createdAt'
            Article.paginate({}, {
                page,
                limit,
                sort: { 'createdAt': -1 }
            }).then((result) => {
                res.render('blog', { ...result })
            })
        } catch {
            res.sendStatus(500)
        }
    }
})

// articles by logged in author
router.get('/blog/myarticles', auth, async (req, res) => {
    var page = 1
    var limit = 5
    // if page or limit are part of request (url string) then save that variable in router scope
    if (req.query.page) {
        page = req.query.page
    }
    if (req.query.limit) {
        limit = req.query.limit
    }
    // find articles with authenticated user's '_id'
    try {
        Article.paginate({ 'author': req.user._id }, {
            page,
            limit,
            sort: { 'createdAt': -1 }
        }).then((result) => {
            res.render('articlesByAuthor', { ...result })
        })
    } catch {
        res.sendStatus(500)
    }
})

// compose
router.get('/blog/compose', auth, async (req, res) => {
    res.render('compose')
})

router.post('/blog/compose', auth, async (req, res) => {
    // replace returns with <br>
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
    // get array of requested updates, and save as new object
    const updates = Object.keys(req.body)
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
        // if article with given id doesn't exist send error
        if (!article) {
            return res.status(400).send()
        }
        // if authenticated user's '_id' doesn't match article '_id', send error
        if (String(req.user._id) != String(article.author)) {
            throw new Error('User is not the author of this article')
        }
        // loop through updates array and apply all updates to user
        req.body.text = req.body.text.replace(/(?:\r\n|\r|\n)/g, '<br>')
        updates.forEach((update) => article[update] = req.body[update])
        // save user
        await article.save()
        res.sendStatus(200)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/blog/updatearticle', auth, async (req, res) => {
    // format article from db to display nicely in textbox
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
    // make sure that the arcicle id exists and is valid, then find matching article
    // and hand to 'updateArticle' template
    if (req.query.article && mongoose.isValidObjectId(req.query.article)) {
        try {
            Article.paginate({ '_id': req.query.article }, {
                limit: 1
            }).then((result) => {
                result.docs[0].text = htmlToPlainText(result.docs[0].text)
                res.render('updateArticle', result.docs[0])
            })
        } catch {
            // if this code is reached, the error must be on the server side
            res.status(500).send()
        }
    } else {
        res.status(400).send()
    }
})

router.delete('/blog/deletearticle', auth, async (req, res) => {
    // find article
    const article = await Article.findOne({ _id: req.query.article })
    try {
        // make sure authenticated user is the author
        if (String(req.user._id) != String(article.author)) {
            throw new Error('You are not the author of this article')
        }
        await Article.findOneAndDelete({ _id: req.query.article })
        res.status(200).send()
    } catch (e) {
        res.status(400).send(e)
    }

})

module.exports = router