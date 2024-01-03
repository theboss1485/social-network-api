const handleDifferentThoughtErrorTypes = require('../utils/handleDifferentThoughtErrorTypes.js');

const Thought = require('../models/Thought.js');
const User = require('../models/User.js');

// This function gets all the thoughts from the Mongoose database.
async function getAllThoughts(req, res){

    try {

        let thoughts = await Thought.find({});
        thoughts.forEach((thought) => thought.geFo)
        res.status(200).json(thoughts);
    
    } catch (error) {

        handleDifferentThoughtErrorTypes(res, error)
    }
}

// This function gets one thought from the Mongoose database, using the thought's ID.
async function getOneThought(req, res){

    try {

        let thought = await Thought.findOne({_id: req.params.id});


        if(thought){

            res.status(200).json(thought)
        
        } else {

            // If the thought ID doesn't match any existing thought IDs, the application throws an error.
            throw new Error("Invalid thought ID");
        }
        
    
    } catch (error) {

        handleDifferentThoughtErrorTypes(res, error)
    }
}

// This function creates a thought and saves it to the database.
async function createThought(req, res){

    try {

        if(req.body.thoughtText && req.body.username){

            let creatorOfThought = await User.findOne({username: req.body.username})
            .populate('thoughts')
            .populate('friends')

            if(creatorOfThought){

                let newThought = await Thought.create({

                    thoughtText: req.body.thoughtText,
                    username: req.body.username
                });

                if(newThought){

                    creatorOfThought.thoughts.push(newThought);
                    let updatedCreatorOfThought = await creatorOfThought.save();
            
                    res.status(201).json({message: "Thought creation successul", newThought: newThought, updatedCreatorOfThought: updatedCreatorOfThought});
                
                } else {

                    console.log("Thought Creation Failed!!")
                }

            } else {

                // If the provided username doesn't match any existing usernames, the application throws an error.
                throw new Error("Invalid username");
            }
            
        } else {
            
            // If the user left a username or thought text out of the request body, the application throws an error.
            throw new Error("Invalid thought text or username");
        }

        

    } catch (error) {


        handleDifferentThoughtErrorTypes(res, error);
    }
}

// This function updates a thought using its ID, and saves the thought to the database.
async function updateThought(req, res){

    try {

        if(req.body.thoughtText){

            let updatedThought = await Thought.findOneAndUpdate(

                {_id: req.params.id},
                {
                    $set: {

                        thoughtText: req.body.thoughtText
                    }
                },
                { new: true}
            )

            if(updatedThought){

                res.status(200).json({message: "Thought update successful", updatedThought: updatedThought});
                
            
            } else {

                // If the thought ID doesn't match any existing thought IDs, the application throws an error.
                throw new Error("Invalid thought ID");
            }

        } else {

            // If the user left thought text out of the request body, the application throws an error.
            throw new Error("Invalid thought text");
        }
    
    } catch(error){

        handleDifferentThoughtErrorTypes(res, error);
    }
}

// This function deletes a thought, using its ID.
async function deleteThought(req, res){

    try {

        let deletedThought = await Thought.findOneAndDelete({_id: req.params.id});

        if(deletedThought){

            await User.findOneAndUpdate(

                { username: deletedThought.username},
                { $pull: { thoughts: deletedThought._id } },
                { new: true }
            );

            res.status(200).json({message: "Thought deleted successfully", deletedThought: deletedThought});
            
        } else {

            // If the thought ID doesn't match any existing thought IDs, the application throws an error.
            throw new Error("Invalid thought ID");
        }
        
    } catch (error) {

        handleDifferentThoughtErrorTypes(res, error);
    }
}

// This function adds a reaction to a thought and saves the thought to the database.
async function addReactionToThought(req, res){

    try {

        let thought = await Thought.findOne({_id: req.params.thoughtId});
        
        if(thought){

            if(req.body.reactionBody){

                let reactionData = {reactionBody: req.body.reactionBody, username: thought.username};

                thought.reactions.push(reactionData);
                let updatedThought = await thought.save();
                res.status(200).json({message: "Reaction creation successful", updatedThought: updatedThought});
            
            } else {

                // If the user left the reaction text out of the request body, the application throws an error.
                throw new Error("Invalid reaction body");
            } 

        } else {

            // If the thought ID doesn't match any existing thought IDs, the application throws an error.
            throw new Error("Invalid thought ID");
        }

    } catch (error) {

        handleDifferentThoughtErrorTypes(res, error);
    }
}

// This function deletes a reaction from a thought by the reaction's ID.
async function DeleteReactionFromThought(req, res){

    try{

        let thought = await Thought.findOne({_id: req.params.thoughtId});
        let reactionToBeDeleted = thought.reactions.find((reaction) => reaction.reactionId.toString() === req.params.reactionId);
        
        if(thought && reactionToBeDeleted){

            thought.reactions = thought.reactions.filter((reaction) => reaction !== reactionToBeDeleted);
            let thoughtWithReactionDeleted = await thought.save();
            res.status(200).json({message: "Reaction deletion successful", thoughtWithReactionDeleted: thoughtWithReactionDeleted}, );

        } else {

            /* If the thought ID doesn't match any existing thought IDs, or the reaction ID doesn't match 
            any existing reaction IDs, the application throws an error.*/
            throw new Error("Invalid thought ID or reaction ID");
        }

    } catch (error) {

        handleDifferentThoughtErrorTypes(res, error);   
    }
}

module.exports = {

    getAllThoughts,
    getOneThought,
    createThought,
    updateThought,
    deleteThought,
    addReactionToThought,
    DeleteReactionFromThought
}