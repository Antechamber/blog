const express = require('express')
const router = new express.Router()
const Article = require('../models/article')
const User = require('../models/user')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


// home
router.get('/', async (req, res) => {
    Article.paginate({}, {
        limit: 1,
        sort: { 'createdAt': -1 }
    }).then((result) => {
        res.render('index', result)
    })

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
            console.log(response)
            res.send('yo')
        })
    } catch {
        res.sendStatus(500)
    }
})

module.exports = router