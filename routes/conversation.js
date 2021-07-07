const express = require("express");
const mongoose = require("mongoose");

// Middleware to check for authentication
const requireLogin = require("../middleware/requireLogin");

// Conversation Model
const Conversation = mongoose.model("Conversation");

// Chat Model
const Chat = mongoose.model("Chat");

// Router from express
const router = express.Router();

// all conversation of a user
router.get("/getConversations", requireLogin, (req, res) => {
  Conversation.find({ members: req.user._id })
    .populate("members", "_id name profileImage")
    .then((conversations) => {
      res.json({ conversations });
    });
});

// get one of the conversation
router.get("/getConversation/:conversationId", requireLogin, (req, res) => {
  Conversation.findOne({ conversationId: req.params.conversationId })
    .populate("members", "_id name profileImage")
    .then((conversation) => {
      res.json({ conversation });
    });
});

router.post("/sendMessage", requireLogin, (req, res) => {
  const chat = new Chat({
    text: req.body.msg,
    sender: req.user._id,
    conversationId: req.body.conversationId,
  });
  chat.save().then(() => {
    res.json({ message: "Sent" });
  });
});

router.post("/receiveMessage", requireLogin, (req, res) => {
  Chat.find()
    .where({ conversationId: req.body.conversationId })
    .populate("sender", "_id name profileImage")
    .sort("createdAt")
    .then((chats) => {
      res.json({ chats });
    });
});

module.exports = router;
