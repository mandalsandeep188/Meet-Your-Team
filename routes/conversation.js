const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Middleware to check for authentication
const requireLogin = require("../middleware/requireLogin");

// Conversation Model
const Conversation = mongoose.model("Conversation");

// Chat Model
const Chat = mongoose.model("Chat");

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

// store message on send
router.post("/sendMessage", requireLogin, (req, res) => {
  const chat = new Chat({
    text: req.body.msg,
    sender: req.user._id,
    conversationId: req.body.conversationId,
  });
  chat.save().then((message) => {
    res.json({ message });
  });
});

// receive message based on conversation Id
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
