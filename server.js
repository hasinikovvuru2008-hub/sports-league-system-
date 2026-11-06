
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Show frontend webpage
app.use(express.static(path.join(__dirname, "public")));

// Team routes
const teamRoutes = require("./routes/teamRoutes");
app.use("/api/teams", teamRoutes);

const playerRoutes = require("./routes/playerRoutes");
app.use("/api/players", playerRoutes);
// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed:", error.message);
    });
