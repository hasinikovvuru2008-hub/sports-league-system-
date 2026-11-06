const express = require("express");
const router = express.Router();

const Team = require("../models/Team");
const Match = require("../models/Match");

// Add team
router.post("/add", async (req, res) => {
    try {
        const team = new Team(req.body);
        await team.save();

        res.json({ message: "Team added successfully!" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all teams
router.get("/", async (req, res) => {
    try {
        const teams = await Team.find();
        res.json(teams);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete team
router.delete("/delete/:id", async (req, res) => {
    try {
        await Team.findByIdAndDelete(req.params.id);

        res.json({ message: "Team deleted successfully!" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update team
router.put("/update/:id", async (req, res) => {
    try {
        const team = await Team.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!team) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        res.json({ message: "Team updated successfully!" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Record match result
router.post("/match", async (req, res) => {
    try {
        const { team1Id, team2Id, winnerId } = req.body;

        if (team1Id === team2Id) {
            return res.status(400).json({
                message: "Please select two different teams."
            });
        }

        if (winnerId !== team1Id && winnerId !== team2Id) {
            return res.status(400).json({
                message: "Winner must be one of the two teams."
            });
        }

        const team1 = await Team.findById(team1Id);
        const team2 = await Team.findById(team2Id);

        if (!team1 || !team2) {
            return res.status(404).json({
                message: "Team not found."
            });
        }

        // Update match statistics
        team1.matchesPlayed += 1;
        team2.matchesPlayed += 1;

        const winner = winnerId === team1Id ? team1 : team2;
        const loser = winnerId === team1Id ? team2 : team1;

        winner.wins += 1;
        winner.points += 2;
        loser.losses += 1;

        await team1.save();
        await team2.save();

        // Save match history
        await Match.create({
            team1: team1Id,
            team2: team2Id,
            winner: winnerId
        });

        res.json({
            message: "Match result saved successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;