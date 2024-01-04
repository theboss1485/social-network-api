/* This file makes it more self-explanatory as to what each one user route does, by
putting the logic for each one inside an appropriately named method, rather than inside
each route itself.*/
const router = require('express').Router();

const {

    getAllThoughts,
    getOneThought,
    createThought,
    updateThought,
    deleteThought,
    addReactionToThought,
    DeleteReactionFromThought

} = require('../../controllers/thought-controller.js');

router.route('/').get(getAllThoughts).post(createThought);
router.route('/:id').get(getOneThought).put(updateThought).delete(deleteThought);
router.route('/:thoughtId/reactions/').post(addReactionToThought);
router.route('/:thoughtId/reactions/:reactionId').delete(DeleteReactionFromThought);


module.exports = router;