const express = require("express");

// Express server instance
const app = express();

// Server made with http
const server = require("http").createServer(app);

// Choosing PORT
const PORT = process.env.PORT || 5000;

// Making mogodb connection
require("./db/connection");

// Database models
require("./db/models/user");

// Setting up json usage
app.use(express.json());

// Routes
app.use(require("./routes/auth"));
app.use(require("./routes/meet"));

// Production setup

if (process.env.NODE_ENV == "production") {
  // Redirect all traffic to https
  app.all("*", function (req, res, next) {
    console.log(
      "req start: ",
      req.secure,
      req.hostname,
      req.url,
      app.get("port")
    );
    if (req.secure) {
      return next();
    }
    res.redirect(
      "https://" + req.hostname + ":" + app.get("secPort") + req.url
    );
  });

  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Listening server on the PORT
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
