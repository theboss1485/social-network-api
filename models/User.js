const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    
    {

        username: {type: String, 
                required: true, 
                unique: true,
                trim: true},
        email: {type: String,
                required: true,
                unique: true,
                validate: {
                    validator: (value) => {

                        return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(value);
                    },
                    message: "You have entered an invalid email address.  Email addresses must be entered in the format test@example.com."
                }
            
            },
        thoughts: [{type: mongoose.Types.ObjectId, ref: "Thought"}],
        friends: [{type: mongoose.Types.ObjectId, ref: "User"}]
    },
    {
        id: false,
        updateValidator: true
    },
);

const User = mongoose.model("User", userSchema);

userSchema.set('toJSON', { virtuals: true });

userSchema.virtual("friendCount").get(function() {

    return this.friends.length;
});



module.exports = User;

