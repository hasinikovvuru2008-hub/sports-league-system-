const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
    playerName: {
        type: String,
        required: true
    },
    age: Number,
    role: String,
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    }
});

module.exports = mongoose.model("Player", playerSchema);