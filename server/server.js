const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const boothRoutes = require("./routes/boothRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/booths", boothRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Wina Bwangu API is running"
    });
});

app.get("/api/test-db", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT COUNT(*) AS transaction_count FROM transactions"
        );

        res.json({
            message: "Database connection successful",
            transactions: rows[0].transaction_count
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Wina Bwangu server running on port ${PORT}`);
});
