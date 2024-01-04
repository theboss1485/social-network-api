/* This file defines and exports the connection to the Mongoose database. */
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECTION_STRING);

module.exports = mongoose.connection;