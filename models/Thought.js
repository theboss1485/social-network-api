const mongoose = require('mongoose');
const formatDate = require('../utils/format-date.js')

// This schema is for the various reactions to thoughts that users can create.
const reactionSchema = new mongoose.Schema(
    
    {
        /* The arrow function by the default keyword ensures that a new ObjectId is generated each
        time a new reaction is created.  The Xpert Learning Assistant told me about this. */
        reactionId: {type: mongoose.Types.ObjectId, default: () => new mongoose.Types.ObjectId()},
        reactionBody: {type: String, required: true, maxLength: 280},
        username: {type: String, required: true},
        createdAt: {type: Date,

            default: Date.now,
        }
    },
    {
        id: false,
        createdAt: false
    }
);

// Here, I am turning on virtuals and disabling the _id column for the reaction schema.
reactionSchema.set('toJSON', { virtuals: true });
reactionSchema.set('_id', false); 

// This virtual method formats the date for the reaction schema.
reactionSchema.virtual('createdAtFormatted').get(function(){

    return formatDate(this.createdAt);
});

// This schema is for the various thoughts that users can create.
const thoughtSchema = new mongoose.Schema(
    
    {
        thoughtText: {type: String, 
                      required: true,
                      minlength: 1,
                      maxLength: 280},

        // The Xpert Learning Assistant AI told me how to format the date.
        createdAt: {type: Date,
                    default: Date.now,
                },

        username: {type: String,
                   required: true
                },

        reactions: [reactionSchema]
    }, 
    {
        id: false,
    }
);
// This virtual method formats the date for the thought schema.
thoughtSchema.virtual('createdAtFormatted').get(function(){

    return formatDate(this.createdAt);
});

thoughtSchema.set('toJSON', { virtuals: true });


const Thought = mongoose.model("Thought", thoughtSchema);

// This virtual method counts the number of reactions that a thought has.
thoughtSchema.virtual("reactionCount").get(function() {

    return this.reactions.length;
})

module.exports = Thought;