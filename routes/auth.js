const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// JWT_SECRET for authentication by jwt
const { JWT_SECRET } = require("../config/keys");

// User Model
const User = mongoose.model("User");

// Router from express
const router = express.router();

// Register post request
router.post("/register", (req, res) => {
  // Getting user data from request body
  const { name, email, password, profileImage } = req.body;

  // Validatting name, email and password
  if (!email || !name || !password) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }

  // Checking if there is already user registered with given email
  User.findOne({ email: email }).then((saveduser) => {
    if (saveduser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email" });
    }
  });

  // Creating new User instance
  const user = new User({
    email,
    password,
    name,
    profileImage,
  });

  // Registering new user
  user
    .save()
    .then((user) => res.json({ message: "Registered successfully" }))
    .catch((err) => console.log(err));
});

// Login post request
router.post("/login", (req, res) => {
  // Getting user credentials from request body
  const { email, password } = req.body;

  // Validating credentials
  if (!email || !password) {
    return res.status(422).json({ error: "Please fill all fields" });
  }

  // Authenticating User from database
  User.findOne({ email: email })
    .populate({ select: "-password" })
    .then((registeredUser) => {
      // If user is not registered with the given email
      if (!registeredUser) {
        return res.status(422).json({ error: "Invalid Email or password" });
      }

      // Checking password is correct
      if (registeredUser.password === password) {
        // If correct password entered
        // logging in the user and getting the user data
        const token = jwt.sign({ _id: registeredUser._id }, JWT_SECRET);
        const { _id, name, email, profileImage } = registeredUser;
        res.json({
          token,
          user: { _id, name, email, profileImage },
        });
      } else {
        // If password is wrong
        return res.status(422).json({ error: "Invalid Email or password" });
      }
    })
    .catch((err) => console.log(err));
});

// Exporting router
module.exports = router;
