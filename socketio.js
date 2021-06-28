const { io } = require("./app");
const { makeId } = require("./utils/uuid");

const meetingRooms = new Set();
const meetingUsers = {};
const meetingChats = {};

// Create new meeting
const newMeeting = (client) => {
  const meetId = makeId(8);
  meetingRooms.add(meetId);
  meetingUsers[meetId] = [];
  meetingChats[meetId] = [];
  client.emit("newMeeting", {
    meetId,
  });
};

// Join meeting with meetId
const joinMeeting = (client, userId, meetId, user) => {
  if (meetId && meetingRooms.has(meetId)) {
    console.log("join meeting", userId, user.name);
    meetingUsers[meetId].push(user);
    client.join(meetId);
    if (userId && user) {
      client.emit("joined-meeting", meetingUsers[meetId], meetingChats[meetId]);
      client.broadcast.to(meetId).emit("user-connected", {
        userId,
        user,
        meetingUsers: meetingUsers[meetId],
      });
    }
  } else {
    client.emit("user-connected", { error: "Invalid meeting link" });
  }
};

// leave meeting
const leaveMeeting = (client, data) => {
  if (data.meetId && meetingRooms.has(data.meetId)) {
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
};

// chat message sending
const sendMessage = (text, user, meetId, time) => {
  if (meetId && meetingRooms.has(meetId)) {
    meetingChats[meetId].push({
      text,
      user,
      time: time.substring(0, time.lastIndexOf(":")),
    });
    io.sockets.in(meetId).emit("receiveMessage", meetingChats[meetId]);
  }
};

module.exports = {
  newMeeting,
  joinMeeting,
  leaveMeeting,
  sendMessage,
  meetingRooms,
  meetingUsers,
};
