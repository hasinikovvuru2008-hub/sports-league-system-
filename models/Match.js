const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
    team1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },
    team2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },
    playedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Match", matchSchema);