const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const { user_id, weight_kg, log_date, week_number } = req.body;

  db.query(
    "INSERT INTO weight_logs (user_id, weight_kg, log_date, week_number) VALUES (?, ?, ?, ?)",
    [user_id, weight_kg, log_date, week_number],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Weight Logged" });
    }
  );
});

router.get("/:userId", (req, res) => {
  db.query(
    "SELECT * FROM weight_logs WHERE user_id = ?",
    [req.params.userId],
    (err, rows) => res.json(rows)
  );
});

module.exports = router;
