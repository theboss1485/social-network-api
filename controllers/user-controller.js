const User = require('../models/User.js');
const Thought = require('../models/Thought.js');
const mongoose = require('mongoose');
const handleDifferentUserErrorTypes = require('../utils/handle-different-user-error-types.js');

const iodash = require('lodash');

// This function gets all the users from the Mongoose database.
async function getAllUsers(req, res){

    try {

        let users = await User.find();
        
        res.status(200).json(users);
    
    } catch (error) {

        handleDifferentUserErrorTypes(res, error)
    }
}

// This function gets one user from the Mongoose database, using the user's ID.
async function getOneUser(req, res){

    try {

        let user = await User.findOne({_id: req.params.id})
        .populate('thoughts')
        .populate('friends');

        if(user){

            res.status(200).json(user);
        
        } else {

            // If the user ID doesn't match any existing thought IDs, the application throws an error.
            throw new Error("Invalid user ID");
        }
        
    } catch (error) {

        handleDifferentUserErrorTypes(res, error)
    }
}

// This function creates a user and saves it to the database.
async function createUser(req, res){

    try {

        if(req.body.email && req.body.username){

            let user = await User.create({

                username: req.body.username,
                email: req.body.email
            });
        
            res.status(201).json({message: "User creation successful", newUser: user});
        
        } else {

            // If the user left a username or email address out of the request body, the application throws an error.
            throw new Error("Missing Info - Email and Username");
        }

    } catch (error) {

        handleDifferentUserErrorTypes(res, error)
    }
}

// This function creates a user and saves it to the database.
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

                /* If the user provided a username in the request body, any thoughts tied to that username
                will be updated to contain the new username. */
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

                // If the system can't find a user based on the provided ID, the application throws an error.
                throw new Error("Invalid user ID");
            }

        } else {

            // If the user left both a username and an email address out of the request body, the application throws an error.
            throw new Error("Missing Info - Email or Username");
        }
    
    } catch(error){

        handleDifferentUserErrorTypes(res, error);
    }
}

// The following function deletes a user and its associated thoughts.
async function deleteUser(req, res){

    let deletedUser = undefined;

    try{

        deletedUser = await User.findOneAndDelete({_id: req.params.id});

        if(deletedUser){

            let deletedThoughts = await Thought.find({username: deletedUser.username});
            let thoughtDeletionResult = await Thought.deleteMany({username: deletedUser.username});

            /* Because Thought.deleteMany() will throw an error if it fails, if the program reaches the following "if"
            condition, we can assume that the thoughts have been deleted successfully. */
            if(deletedThoughts.length !== 0){

                res.status(200).json({message: "User and associated thoughts deleted successfully", deletedUser: deletedUser, 
                                      deletedThoughts: deletedThoughts, thoughtDeletionResult: thoughtDeletionResult});

            } else {

                res.status(200).json({message: "User deleted successfully", deletedUser: deletedUser, });
            }

        } else {

            // If the system can't find a user based on the provided ID, the application throws an error.
            throw new Error("Invalid user ID");
        } 

    } catch (error) {

        handleDifferentUserErrorTypes(res, error);
    }
}

// The following function adds a friend to a user based on the user's ID and the friend's user ID.
async function addFriendToUser(req, res){

    try {

        let user = undefined;
        let friend = undefined;
        let match = undefined

        user = await User.findOne({_id: req.params.userId});
        friend = await User.findOne({_id: req.params.friendId});
        

        if(user && friend){

            match = user.friends.find((friend) => friend.toString() === req.params.friendId);

            if(req.params.userId === req.params.friendId){

                /* If the provided user ID and friend ID are the same, the application throws an error. */
                throw new Error("Duplicate user and friend ID");

            } else if(match !== undefined){

                /* If the provided user ID and friend ID correspond to a user/friend pair where the friend is already on the user's
                friend list, the application throws an error.*/
                throw new Error("User and friend already friends");

            } else {

                user.friends.push(req.params.friendId);
                let updatedUser = await user.save();
                res.status(200).json({message: `friend ${req.params.friendId} added successfully `, updatedUser: updatedUser});
            }



        } else {

            // If the application can't find a user by either the user ID or the friend ID, it will throw an error.
            throw new Error("Invalid user ID or friend ID");
        }

    } catch (error) {

        handleDifferentUserErrorTypes(res, error, true)
    }
}

async function deleteFriendFromUser(req, res){

    let user = undefined;
    let friendToBeDeleted = undefined;

    try{
            
        user = await User.findOne({_id: req.params.userId});
        friendToBeDeleted = await User.findOne({_id: req.params.friendId});

        if(user && friendToBeDeleted){

            if(req.params.userId === req.params.friendId){

                /* Once again, if the provided user ID and friend ID are the same, the application throws an error. */
                throw new Error("Duplicate user and friend ID");
            }

            let updatedFriendsList = user.friends.filter((friend) => friend.toString() !== friendToBeDeleted._id.toString());

            /* The Xpert Learning Assistant told me about the Iodash package.  I am using it to compare if the user's friend list is equal to the user's
            friend list without the friend to be deleted.  If the two are equal, it means the friend didn't exist on the user's friend list in the first place.*/
            if(iodash.isEqual(updatedFriendsList.sort(), user.friends.sort())){

                /* If the friend didn't exist on the user's friend list, the application throws an error. */
                throw new Error("Friend not on user's friend list");

            } else {

                user.friends = updatedFriendsList;
                let userWithFriendDeleted = await user.save();
                res.status(200).json({message: `Deletion of friend ${req.params.friendId} successful`, userWithFriendDeleted: userWithFriendDeleted});
            }
           

        } else {

            // Once again, if the application can't find a user by either the user ID or the friend ID, it will throw an error.
            throw new Error("Invalid user ID or friend ID");
        }

    } catch (error) {

        handleDifferentUserErrorTypes(res, error, true)
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