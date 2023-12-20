const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({

    reactionId: {type: mongoose.Types.ObjectId, default: new mongoose.Types.ObjectId()},
    reactionBody: {type: String, required: true, maxLength: 280},
    username: {type: String, required: true},
    createdAt: {type: Date, 
                default: Date.now,
                get: function (timestamp){
                    return new Date(timestamp).toLocaleDateString();
                }},

});

const thoughtSchema = new mongoose.Schema({

    thoughtText: {type: String, 
                  required: true,
                  maxLength: 280},

    // The Xpert Learning Assistant AI told me how to format the date.
    createdAt: {type: Date,
                default: Date.now,
                get: function (timestamp){
                    return new Date(timestamp).toLocaleDateString();
                }},
    username: {type: String,
               required: true
            },

    reactions: [reactionSchema]
            
});

const Thought = mongoose.model("Thought", thoughtSchema);

thoughtSchema.virtual("reactionCount").get(function() {

    return this.reactions.length;
})

module.exports = Thought;