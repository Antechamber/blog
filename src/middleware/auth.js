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
        res.status(401).render('login')
    }
}

module.exports = auth