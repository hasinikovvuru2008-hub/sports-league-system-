const express = require("express");
const router = express.Router();
const Match = require("../models/Match");

// Get all match history
router.get("/", async (req, res) => {
    try {
        const matches = await Match.find()
            .populate("team1", "teamName")
            .populate("team2", "teamName")
            .populate("winner", "teamName")
            .sort({ playedAt: -1 });

        res.json(matches);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;