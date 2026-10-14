const express = require("express");
const db = require("../config/database");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM booths"
        );

        res.json(rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve booths"
        });
    }
});

module.exports = router;
