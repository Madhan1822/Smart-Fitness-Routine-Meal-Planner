const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const { user_id, goal, level, start_date, is_active } = req.body;

  db.query(
    "INSERT INTO programs (user_id, goal, level, start_date, is_active) VALUES (?, ?, ?, ?, ?)",
    [user_id, goal, level, start_date, is_active],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Program Created" });
    }
  );
});

router.get("/:userId", (req, res) => {
  db.query("SELECT * FROM programs WHERE user_id=?", [req.params.userId],
    (err, data) => res.json(data)
  );
});

module.exports = router;
