const express = require("express");

// Express server instance
const app = express();

// Server made with http
const server = require("http").Server(app);

// Peer server integration
const { ExpressPeerServer } = require("peer");

// Socket IO instance
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Choosing PORT
const PORT = process.env.PORT || 5000;

// Listening server on the PORT
const expServer = server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const peerServer = ExpressPeerServer(expServer, {
  path: "/peer",
});

module.exports = { io };

// Making mogodb connection
require("./db/connection");

// Database models
require("./db/models/user");
require("./db/models/conversation");
require("./db/models/chat");

// Setting up json usage
app.use(express.json());

// use peerServer
app.use(peerServer);

// Routes
app.use(require("./routes/auth"));
app.use(require("./routes/meet"));
app.use(require("./routes/conversation"));

const {
  newMeeting,
  joinMeeting,
  leaveMeeting,
  newConversation,
  joinConversation,
} = require("./socketio");

// Socket IO related events
io.on("connection", (client) => {
  // new meeting created event
  client.on("newMeeting", (name) => newMeeting(client, name));
  client.on("newConversation", (name) => newConversation(client, name));

  // user joined event
  client.on("joinMeeting", (data) => {
    joinMeeting(client, data.id, data.meetId, data.user);
    client.on("disconnect", () => {
      leaveMeeting(client, data);
    });
  });
  client.on("joinConversation", (data) => {
    joinConversation(client, data.id, data.conversationId, data.user);
  });

  // chat event
  client.on("sent-message", (conversationId) => {
    client.broadcast.to(conversationId).emit("receive-message");
  });
});

// ===================== Production setup ===================

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
