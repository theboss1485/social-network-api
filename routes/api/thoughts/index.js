/* This index.js file makes any additional routes coming after /thoughts modular.
If I wanted to add more, I could create another .js file and add them there.*/

const router = require('express').Router();
const reactionRoutes = require('./reaction-routes');


router.use('/:thoughtId/reactions', reactionRoutes);

module.exports = router;