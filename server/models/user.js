const mongoose = require('mongoose');

mongoose.pluralize(function(name) {
    return name;
});
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "user name is empty"],
        unique: true
    },
    password: {
        type: String,
        minLength: [8, 'password too short'],
        required: [true, "no password"],
    },
    commerce_id: {
        type: String,
        required: [true, 'Please create the commerce id'],
        unique:true
    },
    commerce_name:{
        type: String,
        maxLength: [15, 'Commerce name too large'],
        required: [true, 'No name for the commerce has been inserted']
    }
})

const User = mongoose.model('Users', userSchema);

module.exports = {User};