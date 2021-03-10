const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')


const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1
    },
    text: {
        type: String,
        required: true,
        minlength: 1
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

// external pagination module
articleSchema.plugin(paginate)

const Article = mongoose.model('Article', articleSchema)

module.exports = Article