const express = require('express')
const router = new express.Router()
const Project = require('../models/project')

router.get('/projects', async (req, res) => {
    Project.paginate({}, {
        limit: 3,
        sort: { createdAt: -1 }
    }).then((result) => {
        console.log(result)
        res.render('projects', result)
    }).catch((error) => {
        res.render('projects', error)
    })

})

module.exports = router