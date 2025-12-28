const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const { name, type, calories, protein, carbs, fats } = req.body;

  db.query(
    "INSERT INTO meals (name, type, calories, protein, carbs, fats) VALUES (?, ?, ?, ?, ?, ?)",
    [name, type, calories, protein, carbs, fats],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Meal Added" });
    }
  );
});

router.get("/", (req, res) => {
  db.query("SELECT * FROM meals", (err, rows) => res.json(rows));
});

module.exports = router;
