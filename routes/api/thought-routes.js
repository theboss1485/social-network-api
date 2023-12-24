const router = require('express').Router();

const {

    getAllThoughts,
    getOneThought,
    createThought,
    updateThought,
    deleteThought,
    addReactionToThought,
    DeleteReactionFromThought

} = require('../../controllers/thought-contriller.js');

// This GET route gets all users.
router.route('/').get(getAllThoughts).post(createThought);
// This GET route gets a user by ID.
router.route('/:id').get(getOneThought).put(updateThought).delete(deleteThought);

router.route('/:thoughtId/reactions/').post(addReactionToThought);
router.route('/:thoughtId/reactions/:reactionId').delete(DeleteReactionFromThought);


module.exports = router;