const handleDifferentThoughtErrorTypes = require('../utils/handleDifferentThoughtErrorTypes.js');

const Thought = require('../models/Thought.js');
const User = require('../models/User.js');

async function getAllThoughts(req, res){

    try {

        let thoughts = await Thought.find({});
        thoughts.forEach((thought) => thought.geFo)
        res.status(200).json(thoughts);
    
    } catch (error) {

        handleDifferentThoughtErrorTypes(res, error)
    }
}

async function getOneThought(req, res){

    try {

        let thought = await Thought.findOne({_id: req.params.id});


        if(thought){

            res.status(200).json(thought)
        
        } else {

            throw new Error("Invalid thought ID");
        }
        
    
    } catch (error) {

        handleDifferentThoughtErrorTypes(res, error)
    }
}

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

                throw new Error("Invalid username");
            }
            
        } else {

            throw new Error("Invalid thought text or username");
        }

        

    } catch (error) {


        handleDifferentThoughtErrorTypes(res, error);
    }
}

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

                throw new Error("Invalid thought ID");
            }

        } else {

            throw new Error("Invalid thought text");
        }
    
    } catch(error){

        handleDifferentThoughtErrorTypes(res, error);
    }
}

async function deleteThought(req, res){

    try {

        let deletedThought = await Thought.findOneAndDelete({_id: req.params.id});

        if(deletedThought){

            

            await User.findOneAndUpdate(

                { username: deletedThought.username},
                { $pull: { thoughts: deletedThought.id } },
                { new: true }
            );

            res.status(200).json({message: "Thought deleted successfully", deletedThought: deletedThought});
            
        } else {

            throw new Error("Invalid thought ID");
        }
        
    } catch (error) {

        handleDifferentThoughtErrorTypes(res, error);
    }
}

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

                throw new Error("Invalid reaction body");
            } 

        } else {

            throw new Error("Invalid thought ID");
        }

    } catch (error) {

        handleDifferentThoughtErrorTypes(res, error);
    }
}

async function DeleteReactionFromThought(req, res){

    try{

        let thought = await Thought.findOne({_id: req.params.thoughtId});
        let reactionToBeDeleted = thought.reactions.find((reaction) => reaction.reactionId.toString() === req.params.reactionId);
        
        if(thought && reactionToBeDeleted){

            thought.reactions = thought.reactions.filter((reaction) => reaction !== reactionToBeDeleted);
            let thoughtWithReactionDeleted = await thought.save();
            res.status(200).json({message: "Reaction Deletion successful", thoughtWithReactionDeleted: thoughtWithReactionDeleted}, );

        } else {

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