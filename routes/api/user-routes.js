const router = require('express').Router();
const {
    getAllUsers, 
    getOneUser,
    createUser,
    updateUser,
    deleteUser,
    addFriendToUser,
    deleteFriendFromUser
} = require('../../controllers/user-controller.js')



const User = require('../../models/User.js');
const Thought = require('../../models/Thought.js')


// This GET route gets all users.
router.route('/').get(getAllUsers).post(createUser);
// This GET route gets a user by ID.
router.route('/:id').get(getOneUser).put(updateUser).delete(deleteUser);

router.route('/:userId/friends/:friendId').post(addFriendToUser);
router.route('/:userId/friends/:friendId').delete(deleteFriendFromUser);

module.exports = router;