const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({

    reactionId: mongoose.Schema.Types.ObjectId,
    default: new mongoose.Schema.Types.ObjectId()
});

module.exports = reactionSchema;