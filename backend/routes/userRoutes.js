const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/register", (req, res) => {
  const { name, email, password, role, gender, height_cm, age } = req.body;

  const sql = `
    INSERT INTO users (name, email, password_hash, role, gender, height_cm, age)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, email, password, role, gender, height_cm, age],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User Registered Successfully" });
    }
  );
});

router.get("/:id", (req, res) => {
  db.query("SELECT * FROM users WHERE id = ?", [req.params.id],
    (err, result) => res.json(result)
  );
});

module.exports = router;
