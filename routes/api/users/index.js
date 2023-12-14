/* This index.js file makes any additional routes coming after /users modular.
If I wanted to add more, I could create another .js file and add them there.*/

const router = require('express').Router();
const friendRoutes = require('./friend-routes');


router.use('/:userId/friends/:friendId', friendRoutes);

module.exports = router;