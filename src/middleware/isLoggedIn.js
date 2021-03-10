const jwt = require('jsonwebtoken')
const User = require('../models/user')

const isLoggedIn = async (req, res, next) => {
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
        // return username for use in top right dropdown menu
        return user.name
    } catch (e) {
        return
    }
}

module.exports = isLoggedIn