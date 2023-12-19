const mongoose = require('mongoose');

const thoughtSchema = new mongoose.Schema({

    thoughtText: {type: String, 
                  required: true,
                  minLength: 1,
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
    reactions: [{type: mongoose.Schema.Types.ObjectId, ref: "Reaction"}]
            
});

const Thought = mongoose.model("Thought", thoughtSchema);

thoughtSchema.virtual("reactionCount").get(function() {

    return this.reactions.length;
})

try{
    
    Thought.create({

        thoughtText: "My favorite food is pizza!",
        username: "GMorrow12345"
    });
    
    Thought.create({
    
        thoughtText: "My favorite food is ice cream!",
        username: "JMorrow5678",
        
    });
    
    Thought.create({
    
        thoughtText: "I like parrots.",
        username: "NMorrow5378",
        
    });
    
    Thought.create({
    
        thoughtText: "I enjoy software development.",
        username: "BMorrow5228",
        
    });
    
    Thought.create({

        thoughtText: "I enjoy spending time with family.",
        username: "HMorrow5118",
        
    });

} catch (error) {

    console.log("Error", error)
}

module.exports = Thought;