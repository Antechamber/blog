const express = require('express')
const hbs = require('hbs')
const path = require('path')
const mainRouter = require('./routers/mainRouter')
const userRouter = require('./routers/users')
const blogRouter = require('./routers/blog')
const errorRouter = require('./routers/errors')
const projectRouter = require('./routers/projects')
require('./db/mongoose')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const momentHandler = require('handlebars.moment')
const isLoggedIn = require('./middleware/isLoggedIn')


// initialize express app
const app = express()

// express config path names
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsDirectoryPath = path.join(__dirname, '../templates/views')
const partialsDirectoryPath = path.join(__dirname, '../templates/partials')

// set handlebars engine and views location
app.set('view engine', 'hbs') // set view engine to handlebars (hbs, since handlebars was deprecated)
app.set('views', viewsDirectoryPath) // set view directory
app.use(express.static(publicDirectoryPath)) // set public files directory
hbs.registerPartials(partialsDirectoryPath) // register partials to be used by hbs

// helpers
momentHandler.registerHelpers(hbs) // for handling dates
hbs.localsAsTemplateData(app) // for storing app.local.[varName] variables for global access in views as {{[varName]}}

// middleware
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser()) // for storing and reading cookies; for authentication
// define username if user is logged in
app.use(async function (req, res, next) {
    // check if current auth token exists and is valid
    const username = await isLoggedIn(req, res, next)
    if (!username) {
        app.locals.username = undefined
        return next()
    }
    // if username found, shorten if necessary and store as local variable for templates
    if (username.length <= 15) {
        app.locals.username = username
    } else {
        app.locals.username = username.slice(0, 15)
    }
    next()
})

// routers
app.use(mainRouter)
app.use(userRouter)
app.use(blogRouter)
app.use(projectRouter)
app.use(errorRouter)


module.exports = app