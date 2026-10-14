const express = require("express");
const db = require("../config/database");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM services"
        );

        res.json(rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve services"
        });
    }
});

router.get("/booth/:boothCode", async (req, res) => {
    try {
        const { boothCode } = req.params;

        const [rows] = await db.query(
            `SELECT s.*
             FROM services s
             JOIN booth_services bs
             ON s.service_name = bs.service_name
             WHERE bs.booth_code = ?`,
            [boothCode]
        );

        res.json(rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve booth services"
        });
    }
});

module.exports = router;
