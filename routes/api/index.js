
/* This index file makes the /api endpoints modular, so that inquiries to /thoughts and /users
can be directed to the appropriate files for processing.*/
const router = require('express').Router();
const thoughtRoutes = require('./thought-routes');
const userRoutes = require('./user-routes');

router.use('/thoughts', thoughtRoutes);
router.use('/users', userRoutes);

module.exports = router;