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

const {
  newMeeting,
  joinMeeting,
  leaveMeeting,
  sendMessage,
} = require("./socketio");

// Socket IO related events
io.on("connection", (client) => {
  // new meeting created event
  client.on("newMeeting", () => newMeeting(client));

  // user joined event
  client.on("joinMeeting", (data) => {
    joinMeeting(client, data.id, data.meetId, data.user);
    client.on("disconnect", () => {
      console.log("disconnected socket");
      leaveMeeting(client, data);
    });
  });

  // chat event
  client.on("sendMessage", (data) => {
    sendMessage(data.msg, data.user, data.meetId, data.time);
  });
});

// Peer server events
peerServer.on("connection", () => {
  console.log("Connected to peer server");
});

// ===================== Production setup ===================

// https redirect filter
const redirectionFilter = function (req, res, next) {
  const theDate = new Date();
  const receivedUrl = `${req.protocol}:\/\/${req.hostname}:${port}${req.url}`;

  if (req.get("X-Forwarded-Proto") === "http") {
    const redirectTo = `https:\/\/${req.hostname}${req.url}`;
    console.log(`${theDate} Redirecting ${receivedUrl} --> ${redirectTo}`);
    res.redirect(301, redirectTo);
  } else {
    next();
  }
};

if (process.env.NODE_ENV == "production") {
  app.get("/*", redirectionFilter);
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
