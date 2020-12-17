const express = require('express')
const hbs = require('hbs')
const path = require('path')
const mainRouter = require('./routers/mainRouter')

// initialize express app
const app = express()

// express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsDirectoryPath = path.join(__dirname, '../templates/views')
const partialsDirectoryPath = path.join(__dirname, '../templates/partials')

// set handlebars engine and views location
app.set('view engine', 'hbs') // set view engine to handlebars (hbs, since handlebars was deprecated)
app.set('views', viewsDirectoryPath) // set view directory
app.use(express.static(publicDirectoryPath)) // set public files directory
hbs.registerPartials(partialsDirectoryPath) // register partials to be used by hbs

// routers
app.use(mainRouter)


module.exports = app