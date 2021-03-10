const express = require('express')
const router = new express.Router()

// for now redirect all urls that don't have a home back to index
router.get('/*', (req, res) => {
    res.redirect('/')
})

module.exports = router