const { Schema, model } = require('mongoose');

const welcomeSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        required: true
    }
});

module.exports = model('Welcome', welcomeSchema);