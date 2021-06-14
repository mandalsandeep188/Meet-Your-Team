const express = require("express");
const mongoose = require("mongoose");

// Middleware to check for authentication
const requireLogin = require("../middleware/requireLogin");

// User Model
const User = mongoose.model("User");

// Router from express
const router = express.Router();

router.get("/startMeeting", requireLogin, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
