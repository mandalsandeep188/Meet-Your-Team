// User Model

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default:
      "https://firebasestorage.googleapis.com/v0/b/meet-your-team.appspot.com/o/user.jpeg?alt=media&token=7e223194-40f7-4e1f-bb56-9d8d0ec0b5c9",
  },
});

mongoose.model("User", userSchema);
