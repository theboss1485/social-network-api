const router = require('express').Router();
const reactionRoutes = require('./reaction-routes');
const thoughtRoutes = require('./thought-routes');
const userRoutes = require('./user-routes');


router.use('/reactions', reactionRoutes);
router.use('/thoughts', thoughtRoutes);
router.use('/users', userRoutes);

module.exports = router;