const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1
    },
    image: {
        type: Buffer
    },
    href: {
        type: String,
        required: true,
        minlength: 1
    }
})

// external pagination module
projectSchema.plugin(paginate)

module.exports = new mongoose.model('Project', projectSchema)