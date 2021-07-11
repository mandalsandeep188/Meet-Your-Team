const mongoose = require("mongoose");

const { MONGO_URL } = require("../config/keys");

//Mongo DB connection
mongoose.connect(MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
  console.log("Conneted to mongoDB");
});
mongoose.connection.on("error", (err) => {
  console.log("Error connecting mongoDB", err);
});
