import mongoose from 'mongoose'

const tagSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },
    repos: {
        type: [Number],
        required: true
    },
    ownerId: {
        type: Number,
        required: true
    }
})

const Tag = mongoose.model("Tag", tagSchema)

module.exports = Tag