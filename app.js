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

// Setting up json usage
app.use(express.json());

// use peerServer
app.use(peerServer);

// Routes
app.use(require("./routes/auth"));
app.use(require("./routes/meet"));

const { newMeeting, joinMeeting } = require("./socketio");

// Socket IO related events
io.on("connection", (client) => {
  // console.log("Connected to socket io");
  client.on("newMeeting", () => newMeeting(client));
  client.on("joinMeeting", (data) => {
    joinMeeting(client, data.id, data.meetId, data.user);

    client.on("disconnect", () => {
      // console.log("disconnected socket");
      io.sockets.in(data.meetId).emit("user-disconnected", data.id, data.user);
    });
  });
});

// Peer server events
peerServer.on("connection", (client) => {
  // console.log("Connected to peer server");
});

// Production setup
if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
