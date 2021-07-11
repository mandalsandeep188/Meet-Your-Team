// Chat Model
const mongoose = require("mongoose");
const { ObjectID } = mongoose.Schema.Types;

const chatSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    sender: {
      type: ObjectID,
      ref: "User",
    },
    conversationId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.model("Chat", chatSchema);
