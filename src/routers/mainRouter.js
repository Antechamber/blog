const express = require('express')
const router = new express.Router()
const Article = require('../models/article')

// home
router.get('/', async (req, res) => {
    Article.paginate({}, {
        limit: 1,
        sort: { 'createdAt': -1 }
    }).then((result) => {
        res.render('index', result)
    })

})

// projects
router.get('/projects', async (req, res) => {
    res.render('projects')
})

// links column
router.get('/links', (req, res) => {
    try {
        Article.paginate({}, {
            limit: 100,
            sort: { 'createdAt': -1 }
        }).then((result) => {
            var response = []
            result.docs.forEach((doc) => {
                response = response.concat({
                    _id: doc['_id'],
                    createdAt: doc['createdAt'],
                    title: doc['title']
                })
            })
            res.send('yo')
        })
    } catch {
        res.sendStatus(500)
    }
})

module.exports = router