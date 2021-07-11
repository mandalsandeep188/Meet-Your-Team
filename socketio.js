const { io } = require("./app");
const { makeId } = require("./utils/uuid");
const mongoose = require("mongoose");

// Conversation Model
const Conversation = mongoose.model("Conversation");

// current participants of the meeting
const meetingUsers = {};

//=========================== Meeting related ====================

// Create new meeting
const newMeeting = (client, name) => {
  const conversationId = makeId(8);
  const conversation = new Conversation({
    name,
    conversationId,
  });
  meetingUsers[conversationId] = [];
  conversation.save().then(() => {
    client.emit("newMeeting", {
      meetId: conversationId,
    });
  });
};

// Join meeting with meetId
const joinMeeting = (client, userId, conversationId, user) => {
  // join this conversation if exist
  Conversation.findOne({ conversationId }).then((conversation) => {
    if (!conversation) {
      client.emit("user-connected", { error: "Invalid meeting link" });
    } else {
      // socket joining
      if (meetingUsers[conversationId]) meetingUsers[conversationId].push(user);
      else meetingUsers[conversationId] = [user];
      client.join(conversationId);

      if (userId && user) {
        // if user already joined before just join otherwise save in database
        if (conversation.members.indexOf(userId) === -1) {
          Conversation.findOneAndUpdate(
            { conversationId },
            {
              $push: { members: userId },
            },
            { new: true }
          ).then(() => {
            // inform client about joined user
            client.emit(
              "joined-meeting",
              meetingUsers[conversationId],
              conversation
            );
            client.broadcast.to(conversationId).emit("user-connected", {
              userId,
              user,
              meetingUsers: meetingUsers[conversationId],
            });
          });
        } else {
          // inform client about joined user
          client.emit(
            "joined-meeting",
            meetingUsers[conversationId],
            conversation
          );
          client.broadcast.to(conversationId).emit("user-connected", {
            userId,
            user,
            meetingUsers: meetingUsers[conversationId],
          });
        }
      }
    }
  });
};

// leave meeting
const leaveMeeting = (client, data) => {
  Conversation.findOne({ conversationId: data.meetId }).then((conversation) => {
    if (conversation) {
      if (meetingUsers[data.meetId]) {
        meetingUsers[data.meetId].splice(
          meetingUsers[data.meetId].indexOf(data.user),
          1
        );
        client.broadcast
          .to(data.meetId)
          .emit(
            "user-disconnected",
            data.id,
            data.user,
            meetingUsers[data.meetId]
          );
      }
    }
  });
};

//======================== Conversation related =====================

const newConversation = (client, name) => {
  const conversationId = makeId(8);
  const conversation = new Conversation({
    name,
    conversationId,
  });
  meetingUsers[conversationId] = [];
  conversation.save().then(() => {
    client.emit("newConversation", {
      conversationId,
    });
  });
};

const joinConversation = (client, userId, conversationId, user) => {
  // join this conversation if exist
  Conversation.findOne({ conversationId }).then((conversation) => {
    if (!conversation) {
      client.emit("user-connected", { error: "Invalid conversation link" });
    } else {
      // socket joining
      client.join(conversationId);
      if (userId && user) {
        // if user already joined before just join otherwise save in database
        if (conversation.members.indexOf(userId) === -1) {
          Conversation.findOneAndUpdate(
            { conversationId },
            {
              $push: { members: userId },
            },
            { new: true }
          ).then(() => {
            // inform client about joined user
            io.sockets.in(conversationId).emit("user-joined", user);
          });
        }
      }
    }
  });
};

module.exports = {
  newMeeting,
  newConversation,
  joinMeeting,
  joinConversation,
  leaveMeeting,
  meetingUsers,
};
