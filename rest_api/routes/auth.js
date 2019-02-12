const express = require("express");
const authRouter = express.Router();
const User = require("../models/auth");
const bcrypt = require("bcryptjs");

// called when signup post request is made
function signupFunction(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  // called when a new user needs to be created
  function signupResolve(email, password) {
    // generate password hash using bcrypt
    bcrypt
      .genSalt(14)
      .then(bcrypt.hash.bind(null, password))
      // save user details to the db
      .then(function(hash) {
        const newUser = new User({ email, password: hash });

        newUser.save(function(err) {
          if (err) {
            return res.status(401).json({ error: "Signup failed" });
          }
          res.status(200).json({ message: "Signup success!" });
        });
      })
      .catch(function(err) {
        console.debug(err);
        res
          .status(500)
          .send({ error: "Internal Server Error. Contact administrator" });
      });
  }

  // execute only when doc.length != 0
  function signupReject() {
    Promise.reject("Account with this email already exists").catch(function(
      err
    ) {
      res.status(401).send({ error: err });
    });
    return true;
  }

  // check if the user exists
  User.find({ email }).then(function(docs) {
    // if user exists call reject else register the user
    docs.length > 0 ? signupReject() : signupResolve(email, password);
  });
}

// called when login post request is made
function loginFunction(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  function signupResolve(password, doc) {
    bcrypt
      .compare(password, doc.password)
      .then(function(result) {
        if (result) {
          return res.status(200).json({ message: "Login Success" });
        }
        res.status(401).json({ message: "Email or password is incorrect" });
      })
      .catch(function(err) {
        res
          .status(500)
          .json({ error: "Internal Server Error. Contact Administrator" });
      });
  }

  function signupReject() {
    Promise.reject("Your account does not exist, please register").catch(
      function(err) {
        res.status(401).json({ error: err });
      }
    );
  }

  User.findOne({ email }).then(function(doc) {
    Object.keys(doc).length == 0
      ? signupReject()
      : signupResolve(password, doc);
  });
}

authRouter.route("/signup").post(signupFunction);

authRouter.route("/login").post(loginFunction);

module.exports = authRouter;
