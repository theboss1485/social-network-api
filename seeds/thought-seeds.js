const Thought = require('../models/Thought.js');

async function seedThoughts(){
    
    try{
    
        await Thought.create({
    
            thoughtText: "My favorite food is pizza!",
            username: "GMorrow12345"
        });
        
        await Thought.create({
        
            thoughtText: "My favorite food is ice cream!",
            username: "JMorrow5678",
            
        });
        
        await Thought.create({
        
            thoughtText: "I like parrots.",
            username: "NMorrow5378",
            
        });
        
        await Thought.create({
        
            thoughtText: "I enjoy software development.",
            username: "BMorrow5228",
            
        });
        
        await Thought.create({
    
            thoughtText: "I enjoy spending time with family.",
            username: "HMorrow5118",
            
        });
    
        console.log("Thoughts Seeded!!")
    
    } catch (error) {
    
        console.log("Error", error)
    }
}

module.exports = {seedThoughts};
