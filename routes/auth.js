const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../config/keys");
const router = express.Router();

// User Model
const User = mongoose.model("User");

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

  // Hashing password
  bcrypt.hash(password, 12).then((hashedPassword) => {
    // Creating new User instance
    let user = null;
    if (profileImage) {
      user = new User({
        email,
        password: hashedPassword,
        name,
        profileImage,
      });
    } else {
      user = new User({
        email,
        password: hashedPassword,
        name,
      });
    }

    // Registering new user
    user
      .save()
      .then((registeredUser) => {
        const token = jwt.sign({ _id: registeredUser._id }, JWT_SECRET);
        const { _id, name, email, profileImage } = registeredUser;
        res.json({
          message: "Registered successfully",
          token,
          user: { _id, name, email, profileImage },
        });
      })
      .catch((err) => console.log(err));
  });
});

router.post("/login", (req, res) => {
  // Getting user credentials from request body
  const { email, password } = req.body;

  // Validating credentials
  if (!email || !password) {
    return res.status(422).json({ error: "Please fill all fields" });
  }

  // Authenticating User from database
  User.findOne({ email: email })
    .then((registeredUser) => {
      // If user is not registered with the given email
      if (!registeredUser) {
        return res.status(422).json({ error: "Invalid Email or password" });
      }

      // Checking password is correct
      bcrypt.compare(password, registeredUser.password).then((match) => {
        if (match) {
          // If correct password entered
          // logging in the user and getting the user data
          const token = jwt.sign({ _id: registeredUser._id }, JWT_SECRET);
          const { _id, name, email, profileImage } = registeredUser;
          res.json({
            message: "Logged in successfully",
            token,
            user: { _id, name, email, profileImage },
          });
        } else {
          // If password is wrong
          return res.status(422).json({ error: "Invalid Email or password" });
        }
      });
    })
    .catch((err) => console.log(err));
});

router.post("/checkEmail", (req, res) => {
  const { email } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (user) {
      return res.json({ error: "User already exists with that email" });
    } else {
      return res.json({ error: null });
    }
  });
});

module.exports = router;
