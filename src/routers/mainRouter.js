const express = require('express')
const router = new express.Router()
const Article = require('../models/article')

// home
router.get('/', async (req, res) => {
    // find most recently created article and give to 'index' template
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

module.exports = router