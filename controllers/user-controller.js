const User = require('../models/User.js');
const Thought = require('../models/Thought.js');
const mongoose = require('mongoose');
const { CastError } = mongoose.Error;
const handleDifferentUserErrorTypes = require('../utils/handleDifferentUserErrorTypes.js');

const iodash = require('lodash');

async function getAllUsers(req, res){

    try {

        let users = await User.find();
        
        res.status(200).json(users);
    
    } catch (error) {

        handleDifferentUserErrorTypes(res, error)
    }
}

async function getOneUser(req, res){

    try {

        let user = await User.findOne({_id: req.params.id})
        .populate('thoughts')
        .populate('friends');

        if(user){

            res.status(200).json(user);
        
        } else {

            throw new Error("Invalid user ID");
        }
        
    } catch (error) {

        handleDifferentUserErrorTypes(res, error)
    }
}

async function createUser(req, res){

    try {

        if(req.body.email && req.body.username){

            let user = await User.create({

                username: req.body.username,
                email: req.body.email
            });
        
            res.status(201).json({message: "User creation successful", newUser: user});
        
        } else {

            throw new Error("Missing Info - Email and Username");
        }

    } catch (error) {

        handleDifferentUserErrorTypes(res, error)
    }
}

async function updateUser(req, res){

    let updatedUser = undefined;
    let updatedThoughts = undefined

    try {

        if(req.body.email || req.body.username){

            let userToBeUpdated = await User.findOne({_id: req.params.id});

            if(userToBeUpdated){

                let oldUsername = userToBeUpdated.username;

                await User.updateOne(
                    
                    {_id: req.params.id},
                    {
                        $set: {

                            ...(req.body.username && { username: req.body.username }),
                            ...(req.body.email && { email: req.body.email})
                        }
                    },
                    { 
                        new: true,
                        runValidators: true
                    }
                );

                if(req.body.username){

                    await Thought.updateMany({username: oldUsername},{ $set: { username: req.body.username, 'reactions.$[].username': req.body.username } });
                    updatedThoughts = await Thought.find({username: req.body.username});
                }

                updatedUser = await User.findOne({_id: req.params.id});

            

                if(updatedThoughts.length !== 0){

                    res.status(200).json({message: "User and thought update successful", updatedUser: updatedUser, updatedThoughts: updatedThoughts});

                } else {

                    res.status(200).json({message: "User update successful", updatedUser});
                }

            } else {

                throw new Error("Invalid user ID");
            }

        } else {

            throw new Error("Missing Info - Email or Username");
        }
    
    } catch(error){

        console.log("Error", error);

        handleDifferentUserErrorTypes(res, error);
    }
}

async function deleteUser(req, res){

    let deletedUser = undefined;

    try{

        deletedUser = await User.findOneAndDelete({_id: req.params.id});

        if(deletedUser){

            let deletedThoughts = await Thought.find({username: deletedUser.username});
            let thoughtDeletionResult = await Thought.deleteMany({username: deletedUser.username});

            if(deletedThoughts){

                res.status(200).json({message: "User and associated thoughts deleted successfully", deletedUser: deletedUser, 
                                      deletedThoughts: deletedThoughts, thoughtDeletionResult: thoughtDeletionResult});

            } else {

                res.status(200).json({message: "User deleted successfully", deletedUser: deletedUser, });
            }

        } else {

            throw new Error("Invalid user ID");
        } 

    } catch (error) {

        handleDifferentUserErrorTypes(res, error);
    }
}

async function addFriendToUser(req, res){

    try {

        let user = undefined;
        let friend = undefined;
        let match = undefined

        /*This try...catch is to replace CastErrors with my own custom error message.*/
        try{

            user = await User.findOne({_id: req.params.userId});
            friend = await User.findOne({_id: req.params.friendId});
            match = user.friends.find((friend) => friend.toString() === req.params.friendId);

        } catch (error) {

            if(error instanceof CastError){

                console.log(error)

            }
        }
        
        if(user && friend){

            if(req.params.userId === req.params.friendId){

                throw new Error("Duplicate user and friend ID");

            } else if(match !== undefined){

                throw new Error("User and friend already friends");

            } else {

                user.friends.push(req.params.friendId);
                let updatedUser = await user.save();
                res.status(200).json({message: `friend ${req.params.friendId} added successfully `, updatedUser: updatedUser});
            }



        } else {

            throw new Error("Invalid user ID or friend ID");
        }

    } catch (error) {

        handleDifferentUserErrorTypes(res, error)
    }
}

async function deleteFriendFromUser(req, res){

    let user = undefined;
    let friendToBeDeleted = undefined;

    try{

        try{
            
            user = await User.findOne({_id: req.params.userId});
            friendToBeDeleted = await User.findOne({_id: req.params.friendId});

        } catch (error) {

            if(error instanceof CastError){

                console.log(error);
                
            }
        }
        
        if(user && friendToBeDeleted){

            if(req.params.userId === req.params.friendId){

                throw new Error("Duplicate user and friend ID");
            }

            let updatedFriendsList = user.friends.filter((friend) => friend.toString() !== friendToBeDeleted._id.toString());


            /* The Xpert Learning Assistant told me about the Iodash package.  I am using it to compare if the user's friend list is equal to the user's
            friend list without the friend to be deleted.  If the two are equal, it means the friend didn't exist on the user's friend list in the first place.*/
            if(iodash.isEqual(updatedFriendsList.sort(), user.friends.sort())){

                throw new Error("Friend not on user's friend list");

            } else {

                user.friends = updatedFriendsList;
                let userWithFriendDeleted = await user.save();
                res.status(200).json({message: `Deletion of friend ${req.params.friendId} successful`, userWithFriendDeleted: userWithFriendDeleted});
            }
           

        } else {

            throw new Error("Invalid user ID or friend ID");
        }

    } catch (error) {

        handleDifferentUserErrorTypes(res, error)
    }
}

module.exports = {

    getAllUsers, 
    getOneUser,
    createUser,
    updateUser,
    deleteUser,
    addFriendToUser,
    deleteFriendFromUser
}