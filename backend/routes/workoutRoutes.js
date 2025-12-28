const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const { name, type, difficulty, calories_burned } = req.body;

  db.query(
    "INSERT INTO workouts (name, type, difficulty, calories_burned) VALUES (?, ?, ?, ?)",
    [name, type, difficulty, calories_burned],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Workout Added" });
    }
  );
});

router.get("/", (req, res) => {
  db.query("SELECT * FROM workouts", (err, rows) => res.json(rows));
});

module.exports = router;
