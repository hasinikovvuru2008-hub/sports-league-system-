

const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    coach: {
        type: String,
        required: true
    },
    captain: {
        type: String,
        required: true
    },
    matchesPlayed: {
        type: Number,
        default: 0
    },
    wins: {
        type: Number,
        default: 0
    },
    losses: {
        type: Number,
        default: 0
    },
    points: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("Team", teamSchema);
