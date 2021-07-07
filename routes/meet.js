const express = require("express");

const mongoose = require("mongoose");

// Conversation Model
const Conversation = mongoose.model("Conversation");

// Middleware to check for authentication
const requireLogin = require("../middleware/requireLogin");

// Router from express
const router = express.Router();

router.get("/startmeet", requireLogin, (req, res) => {
  res.json({ user: req.user });
});

router.get("/meeting/:meetId", requireLogin, (req, res) => {
  Conversation.findOne({ conversationId: req.params.meetId }).then(
    (conversation) => {
      if (!conversation) res.json({ meetError: "Invalid meeting link" });
      else res.json({});
    }
  );
});

module.exports = router;
