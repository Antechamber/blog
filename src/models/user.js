const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const Article = require('./article')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email not valid...')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password') | value.includes(' ')) {
                throw new Error('Password not valid...')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

// virtual props
// adds a virtual prop to the user scheme. This way, all of a user's articles can be populated into a field on the User instance
userSchema.virtual('articles', {
    ref: 'Article',
    localField: '_id',
    foreignField: 'author'
})

// METHODS

// creates a token containing encrypted user id and expiration date 
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET, { expiresIn: '2 hours' })
    user.tokens = user.tokens.concat({ token })
    // save generated token from current instance of User to the record in the DB
    await user.save()
    // reutrn token to be saved as a browser cookie
    return token
}

// creates sanitized version of user object with private info removed
userSchema.methods.toJSON = function () {
    const user = this
    const userPublicInfo = user.toObject()
    delete userPublicInfo.password
    delete userPublicInfo.tokens
    delete userPublicInfo.avatar
    return userPublicInfo
}


// lookup user based on provided credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to log in. Plaese try again.')
    }
    // compare given password with found user's with bcrypt
    const isMatchingPass = await bcrypt.compare(password, user.password)
    if (!isMatchingPass) {
        throw new Error('Unable to log in. Please try again.')
    }
    return user
}

// user specific middleware (runs when 'save' method called but before it 'save' runs)
// hash plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    // hash password
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    // end Schema.pre()
    next()
})

// delete a user's articles when deleting user
userSchema.pre('remove', async function (next) {
    const user = this
    await Article.deleteMany({ author: user._id })
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User