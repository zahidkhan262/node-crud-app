const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },

    password: {
        type: String,
        require: true
    }

});
//we can export like this

// module.exports = mongoose.model("User", userSchema)

mongoose.model("User", userSchema)
