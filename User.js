const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: String,
    email: String
});

module.exports = mongoose.model('User', userSchema);
