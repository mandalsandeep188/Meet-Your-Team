const express = require("express");
const mongoose = require("mongoose");

// Middleware to check for authentication
const requireLogin = require("../middleware/requireLogin");

// User Model
const User = mongoose.model("User");

// Router from express
const router = express.Router();

const getMeet = require("../utils/getMeet");

const { meetingRooms } = require("../socketio");

router.get("/startMeeting", requireLogin, (req, res) => {
  res.json({ user: req.user });
});

router.get("/:meetId", requireLogin, (req, res) => {
  // const meet = getMeet(req.params.meetId);
  // if (meetingRooms.has(req.params.meetId))
  res.json({ user: req.user });
  // else res.json({ error: "Invalid meeting link" });
});

module.exports = router;
