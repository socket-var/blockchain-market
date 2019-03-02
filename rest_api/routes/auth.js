const express = require("express");
const authRouter = express.Router();
const User = require("../models/auth");
const bcrypt = require("bcryptjs");

// called when signup post request is made
async function signupFunction(req, res, next) {
  const { accountAddress, email, password, accountType } = req.body;
  // called when a new user needs to be created

  // check if the user exists

  let matchedDoc;
  try {
    matchedDoc = await User.findOne({ email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Network error, try again" });
  }

  if (!matchedDoc) {
    let hash;
    try {
      const salt = await bcrypt.genSalt(14);

      hash = await bcrypt.hash(password, salt);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .send({ message: "Signup failed. Malformed password. Try again." });
    }

    const newUser = new User({
      bcAddress: accountAddress,
      email,
      password: hash,
      accountType
    });

    let savedUser;
    try {
      savedUser = await newUser.save();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: "Signup failed. Try again" });
    }
    res.status(200).json({ message: "Signup success!", user: savedUser });
  } else {
    res.status(401).send({ message: "Account with this email already exists" });
  }
}

// called when login post request is made
async function loginFunction(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  let userDoc;
  try {
    userDoc = await User.findOne({ email });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Network error. Try again." });
  }

  if (userDoc) {
    const result = await bcrypt.compare(password, userDoc.password);

    if (result) {
      return res.status(200).json({ message: "Login Success", user: userDoc });
    }
    res.status(401).json({ message: "Email or password is incorrect" });
  } else {
    res
      .status(401)
      .json({ message: "Your account does not exist, please register" });
  }
}

authRouter.route("/signup").post(signupFunction);

authRouter.route("/login").post(loginFunction);

module.exports = authRouter;
