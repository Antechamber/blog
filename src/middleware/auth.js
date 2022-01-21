// This module validates an existing session as being both valid to an existing user in the DB as well as not past it's expiration date
// cookies are expected to be of the form 'Authorization: Bearer {TOKEN}'

// jwt decodes hashed values, needs to be given the secret
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {

        // read in bearer auth code and remove the string 'Bearer'
        const token = req.cookies['Authorization'].replace('Bearer ', '')

        // verify token from req with secret 
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // since id is encoded in authToken, lookup user by decoded id
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }
        // attach token and user object to req and pass to router
        req.token = token
        req.user = user
        next()
    } catch (e) {
        // if any part of auth fails, return user to login page
        res.status(401).render('login')
    }
}

module.exports = auth