const express = require("express");
const db = require("../config/database");

const router = express .Router();


router.post("/login", async(req, res) => {
    try{
       const {username, password} = req.body;
       
       if (!username || !password){
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });
       }

       const [rows] = await db.query(
        "SELECT user_id, username, role FROM users WHERE username = ? AND password_hash = ?",
        [username, password]
       );

       if (rows.length === 0){
        return res.status(401).json({
            success: false,
            message: "Invalid username or password"
        });
       }

       const user = rows[0];

       return res.json({
        success: true,
        username: user.username,
        role:user.role
       });

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
});
router.post("/register", async (req, res) => {
    try {
        const {username, password} = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Useranme and password are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        const [existing] = await db.query(
            "SELECT user_id FROM users WHERE username = ?",
            [username]
        );

        if (existing.length >0) {
            return res.status(409).json({
                success: false,
                message: "That username is already taken"
            });
        }

        await db.query(
            "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
            [username, password, "agent"]
        );

        return res.status(201).json({
            success: true,
            username: username,
            role: "agent"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
});

module.exports = router;