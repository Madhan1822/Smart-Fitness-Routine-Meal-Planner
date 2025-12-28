const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ? AND password_hash = ?",
    [email, password],
    (err, result) => {
      if (err || result.length === 0)
        return res.status(401).json({ message: "Invalid credentials" });

      res.json({ message: "Login successful", user: result[0] });
    }
  );
});

module.exports = router;

