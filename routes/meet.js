const express = require("express");

// Middleware to check for authentication
const requireLogin = require("../middleware/requireLogin");

// Router from express
const router = express.Router();

const { meetingRooms } = require("../socketio");

router.get("/startmeet", requireLogin, (req, res) => {
  res.json({ user: req.user });
});

router.get("/meeting/:meetId", requireLogin, (req, res) => {
  if (meetingRooms.has(req.params.meetId)) res.json({ user: req.user });
  else res.json({ meetError: "Invalid meeting link" });
});

module.exports = router;
