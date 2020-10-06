import mongoose from 'mongoose'
// const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true
    },
    _id: {
        type: Number,
        required: true
    }
})

const User = mongoose.model("User", userSchema)

export default User