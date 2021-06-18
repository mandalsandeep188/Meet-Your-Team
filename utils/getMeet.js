const { io } = require("../app");

const getMeet = (meetId) => {
  const meet = io.sockets.adapter.rooms.get(meetId);
  return meet;
};

module.exports = getMeet;
