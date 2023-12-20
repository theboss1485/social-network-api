const router = require('express').Router();

const Thought = require('../../models/Thought.js');
const User = require('../../models/User');

// This GET route gets all thoughts.
router.get('/', async (req, res) => {
  
    try {

        let thoughts = await Thought.find({});
        res.status(200).json(thoughts);
    
    } catch (error) {

        console.log(error);
        res.status(500).json(error);
    }
});

// This GET route gets a thought by ID.
router.get('/:id', async (req, res) => {

    try {

        let thought = await Thought.findOne({_id: req.params.id});
        res.status(200).json(thought);
    
    } catch (error) {

        console.log(error);
        res.status(500).json(error);
    }
  
});

// This POST route adds a new thought.
router.post('/', async (req, res) => {

    try {

        let creatorOfThought = await User.findOne({username: req.body.username});

        if(creatorOfThought){

            let newThought = await Thought.create({

                thoughtText: req.body.thoughtText,
                username: req.body.username
            });

            creatorOfThought.thoughts.push(newThought);
            let updatedCreatorOfThought = await creatorOfThought.save();
        
            res.status(201).json(newThought + updatedCreatorOfThought);

        } else {

            res.status(404).json({message: "Invalid username!  Try again."})
        }

    } catch (error) {

        console.log(error);
        res.status(500).json(error);
    }

});

// This PUT route updates a thought by ID.
router.put('/:id', async (req, res) => {
  
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

                res.status(200).json(updatedThought);
                console.log(`Update Result: ${updatedThought}`);
            
            } else {

                res.status(404).json({message: "No user found with the specified ID."})
            }

        } else {

            throw new Error("You must specify thought text in the request body.");
        }
    
    } catch(error){

        console.log(error);
        res.status(500).json(error);
    }
});

//This DELETE route deletes a thought by ID.
router.delete('/:id', async (req, res) => {

    try {

        let deletedThought = await Thought.findOneAndDelete({_id: req.params.id});

        if(deletedThought){

            console.log(`Deletion Result: ${result}`);
            res.status(200).json(deletedThought);
            
        } else {

            res.status(404).json({message: "Thought not found with specified ID."})
        }
        
    } catch (error) {

        console.log(error);
        res.status(500).json(error);
    }
});

router.post('/:thoughtId/reactions/', async (req, res) => {

    try {

        let thought = await Thought.findOne({_id: req.params.userId});
        
        if(thought){

            let reactionData = {reactionBody: req.body.reactionBody, username: thought.username};

            thought.reactions.push(reactionData);
            let updatedThought = await thought.save();
            console.log("Update Result", updatedThought);
            res.status(200).json(updatedThought);

        } else {

            res.status(404).json({message: "Invalid thought ID"})
        }

    } catch (error) {

        console.log(error);
        res.status(500).json(error);
    }
});

router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {

    try{

        let thought = await Thought.findOne({_id: req.params.userId});
        let reactionToBeDeleted = await User.findOne({_id: req.params.reactionId})
        
        if(thought && reactionToBeDeleted){

            thought.reactions = thought.reactions.filter((reaction) => reaction !== reactionToBeDeleted);
            let thoughtWithReactionDeleted = await thought.save();
            console.log("Deletion Result", thoughtWithReactionDeleted);
            res.status(200).json(thoughtWithReactionDeleted);

        } else {

            res.status(404).json({message: "Invalid thought ID or reaction ID"})
        }

    } catch (error) {

        console.log(error);
        res.status(500).json(error);
    }
});



module.exports = router;