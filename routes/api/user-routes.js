const router = require('express').Router();

const User = require('../../models/User.js');
const Thought = require('../../models/Thought.js')
const {handleDifferentErrorTypes} = require('../../utils/handleDifferentErrorTypes.js')

// This GET route gets all users.
router.get('/', async (req, res) => {

    try {

        let users = await User.find({});
        res.status(200).json(users);
    
    } catch (error) {

        console.log(error);
        res.status(500).json(error);

    }
});

// This GET route gets a user by ID.
router.get('/:id', async (req, res) => {
  
    try {

        let user = await User.findOne({_id: req.params.id});
        res.status(200).json(user);
    
    } catch (error) {

        console.log(error);
        res.status(500).json(error);
    }
});

// This POST route adds a new user.
router.post('/', async (req, res) => {

    try {

        let user = await User.create({

            username: req.body.username,
            email: req.body.email
        });
    
        res.status(201).json(user);

    } catch (error) {

        console.log(error);
        res.status(500).json(error);
    }
});

// This PUT route updates a user by ID.
router.put('/:id', async (req, res) => {

    let updatedUser = undefined;

    try {

        if(req.body.email || req.body.username){

            updatedUser = await User.findOneAndUpdate(

                {_id: req.params.id},

                // The Xpert Learning assistant AI gave me the syntax for the $set operator.
                {
                    $set: {

                        ...(req.body.username && { username: req.body.username }),
                        ...(req.body.email && { email: req.body.email})
                    }
                },
                { new: true}
            )

            if(updatedUser){

                res.status(200).json(updatedUser);
                console.log(`Update Result: ${updatedUser}`);
            }

        } else {

            throw new Error("Missing Info - Email or Username");
        }
    
    } catch(error){

        if(error.name === "CastError"){
                
            res.status(404).json({message: "User not found with specified ID."})
        
        } else {

            console.log(error);
            res.status(500).json(error);
        }
    }
});

//This DELETE route deletes a user by ID.
router.delete('/:id', async (req, res) => {

    let deletedUser = undefined;

    try {

        try{

            deletedUser = await User.findOneAndDelete({_id: req.params.id});
        
        } catch (error){

            if(error.name === "CastError"){
                
                res.status(404).json({message: "User not found with specified ID."})
            }
        }
       

        if(deletedUser){

            let deletedThoughts = await Thought.deleteMany({username: deletedUser.username});

            if(deletedThoughts){

                res.status(200).json("User and Associated Thoughts Deleted");

            } else {

                res.status(200).json("User Deleted");
            }
        }

    } catch (error) {

        console.log(error);
        res.status(500).json(error);
    }
});

router.post('/:userId/friends/:friendId', async (req, res) => {

    try {

        let user = await User.findOne({_id: req.params.userId});
        let friend = await User.findOne({_id: req.params.friendId});
        
        if(user && friend){

            user.friends.push(req.params.friendId);
            let updatedUser = await user.save();
            console.log("Update Result", updatedUser);
            res.status(200).json(updatedUser);

        } else {

            res.status(404).json({message: "Invalid user ID or friend ID"})
        }

    } catch (error) {

        console.log(error);
        res.status(500).json(error);
    }
});

router.delete('/:userId/friends/:friendId', async (req, res) => {

    try{

        let user = await User.findOne({_id: req.params.userId});
        let friendToBeDeleted = await User.findOne({_id: req.params.friendId})
        
        if(user && friendToBeDeleted){

            user.friends = user.friends.filter((friend) => friend !== friendToBeDeleted);
            let userWithFriendDeleted = await user.save();
            console.log("Deletion Result", userWithFriendDeleted);
            res.status(200).json(userWithFriendDeleted)

        } else {

            res.status(404).json({message: "Invalid user ID or friend ID"})
        }

    } catch (error) {

        console.log(error);
        res.status(500).json(error);
    }
});

module.exports = router;