const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    username: {type: String, 
               required: true, 
               unique: true,
               trim: true},
    email: {type: String,
            required: true,
            unique: true,
            validate: {
                validator: (value) => {

                    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
                },
                message: "You have entered an invalid email address."
            }},
    thoughts: [{type: mongoose.Types.ObjectId, ref: "Thought"}],
    friends: [{type: mongoose.Types.ObjectId, ref: "User"}]
});

const User = mongoose.model("User", userSchema);

module.exports = User;