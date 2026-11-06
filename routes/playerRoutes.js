

const express = require("express");
const router = express.Router();
const Player = require("../models/Player");

// Add player
router.post("/add", async (req, res) => {
    try {
        const player = new Player(req.body);
        await player.save();

        res.json({
            message: "Player added successfully!"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Get all players
router.get("/", async (req, res) => {
    try {
        const players = await Player.find().populate("team", "teamName");

        res.json(players);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Delete player
router.delete("/delete/:id", async (req, res) => {
    try {
        const player = await Player.findByIdAndDelete(req.params.id);

        if (!player) {
            return res.status(404).json({
                message: "Player not found!"
            });
        }

        res.json({
            message: "Player deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Edit player
router.put("/update/:id", async (req, res) => {
    try {
        const player = await Player.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!player) {
            return res.status(404).json({
                message: "Player not found!"
            });
        }

        res.json({
            message: "Player updated successfully!",
            player: player
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
