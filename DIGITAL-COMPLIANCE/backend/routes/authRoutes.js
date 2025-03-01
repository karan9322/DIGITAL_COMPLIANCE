const express = require("express");
const { login, register } = require("../controllers/authController");
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Auth routes are working!" });
});

// Login route
router.post("/login", login);

// Register route
router.post("/register", register);

module.exports = router;
