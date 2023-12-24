const Thought = require('../models/Thought.js');
const User = require('../models/User.js');

async function seedThoughts(){
    
    try{

        await createThoughtForSeedAndUpdateUser("My favorite food is pizza!", "GMorrow1234");
        await createThoughtForSeedAndUpdateUser("My favorite food is ice cream!", "JMorrow5678");
        await createThoughtForSeedAndUpdateUser("I like parrots.", "NMorrow5378");
        await createThoughtForSeedAndUpdateUser("I enjoy software development.", "BMorrow5228");
        await createThoughtForSeedAndUpdateUser("I enjoy spending time with family.", "HMorrow5118");
    
        console.log("Thoughts Seeded!!")
    
    } catch (error) {
    
        console.log("Error", error)
    }
}

async function createThoughtForSeedAndUpdateUser(thoughtText, username){

    let newThought = await Thought.create({

        thoughtText: thoughtText,
        username: username
    });

    let creatorOfThought = await User.findOne({username: username});

    if(creatorOfThought){

        creatorOfThought.thoughts.push(newThought._id);
        await creatorOfThought.save();
    
    } else {

        throw new Error("Created thought must have a username that matches a user.")
    }
}

module.exports = {seedThoughts};
