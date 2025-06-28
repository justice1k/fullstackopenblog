const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        requried: [true, 'Username is required'],
        minLength: 3,
        maxLength: 255,
        unique: [true, 'username already exists'],
    },
    name: String,
    passwordHash: String,
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = document._id
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema);
