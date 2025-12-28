const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const { user_id, activity_level, medical_conditions, target_weight } = req.body;

  db.query(
    "INSERT INTO user_profiles (user_id, activity_level, medical_conditions, target_weight) VALUES (?, ?, ?, ?)",
    [user_id, activity_level, medical_conditions, target_weight],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Profile Created" });
    }
  );
});

module.exports = router;
