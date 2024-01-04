/* This file makes it more self-explanatory as to what each one user route does, by
putting the logic for each one inside an appropriately named method, rather than inside
each route itself.*/
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

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getOneUser).put(updateUser).delete(deleteUser);
router.route('/:userId/friends/:friendId').post(addFriendToUser);
router.route('/:userId/friends/:friendId').delete(deleteFriendFromUser);

module.exports = router;