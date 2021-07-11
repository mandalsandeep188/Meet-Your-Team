// Conversation Model

const mongoose = require("mongoose");
const { ObjectID } = mongoose.Schema.Types;

const conversationSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  members: [{ type: ObjectID, ref: "User" }],
});

mongoose.model("Conversation", conversationSchema);
