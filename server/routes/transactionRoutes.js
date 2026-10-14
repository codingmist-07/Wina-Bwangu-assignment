const express = require("express");
const db = require("../config/database");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT
                t.transaction_id,
                t.booth_code,
                b.location,
                t.service_name,
                s.rate,
                t.transaction_amount
             FROM transactions t
             JOIN booths b
                ON t.booth_code = b.booth_code
             JOIN services s
                ON t.service_name = s.service_name
             ORDER BY t.transaction_id`
        );

        res.json(rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve transactions"
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const {
            boothCode,
            serviceName,
            transactionAmount
        } = req.body;

        if (!boothCode || !serviceName || !transactionAmount) {
            return res.status(400).json({
                message: "Booth, service and transaction amount are required"
            });
        }

        const [booth] = await db.query(
            "SELECT * FROM booths WHERE booth_code = ?",
            [boothCode]
        );

        if (booth.length === 0) {
            return res.status(400).json({
                message: "Invalid booth"
            });
        }

        const [service] = await db.query(
            `SELECT s.*
             FROM services s
             JOIN booth_services bs
             ON s.service_name = bs.service_name
             WHERE bs.booth_code = ?
             AND s.service_name = ?`,
            [boothCode, serviceName]
        );

        if (service.length === 0) {
            return res.status(400).json({
                message: "Service is not available at this booth"
            });
        }

        if (transactionAmount < 20 || transactionAmount > 10000) {
            return res.status(400).json({
                message: "Transaction amount must be between K20 and K10,000"
            });
        }

        const [lastTransaction] = await db.query(
    `SELECT transaction_id
     FROM transactions
     ORDER BY transaction_id DESC
     LIMIT 1`
);

let nextNumber = 1;

if (lastTransaction.length > 0) {
    const lastId = lastTransaction[0].transaction_id;
    const numberPart = parseInt(lastId.substring(2), 10);

    nextNumber = numberPart + 1;
}

const transactionId = `WB${String(nextNumber).padStart(7, "0")}`;

const rate = service[0].rate;

const amount = Number(transactionAmount);

const commission = amount * rate;
const tax = commission * 0.16;
const revenueAfterTax = commission - tax;
const amountAfterTax = amount - tax;

const [result] = await db.query(
    `INSERT INTO transactions
     (transaction_id, booth_code, service_name, transaction_amount)
     VALUES (?, ?, ?, ?)`,
    [
        transactionId,
        boothCode,
        serviceName,
        amount
    ]
);

res.status(201).json({
    message: "Transaction created successfully",
    transactionId: transactionId,
    boothCode: boothCode,
    serviceName: serviceName,
    rate: rate,
    transactionAmount: amount,
    commission: commission,
    tax: tax,
    revenueAfterTax: revenueAfterTax,
    amountAfterTax: amountAfterTax
});

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create transaction"
        });
    }
});

module.exports = router;
