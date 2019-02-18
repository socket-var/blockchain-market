const express = require("express");
const adminRouter = express.Router();
const Product = require("../models/Product");
const User = require("../models/auth");

function listAllUsers(req, res, next) {
  const userId = req.params.userId;

  User.findOne({ _id: userId })
    .then(user => {
      if (user.isAdmin) {
        return User.find({});
      } else {
        throw "User is not an admin";
      }
    })
    .then(users => res.status(200).json({ users }))
    .catch(err => {
      console.debug(err);
      res.status(403).json({ errorMessage: "Unauthorized or Server Error" });
    });
}

function deleteUser(req, res, next) {
  const { userId, userIdToRemove } = req.params;

  User.findOne({ _id: userId })
    .then(user => {
      if (user.isAdmin) {
        return User.findByIdAndDelete(userIdToRemove);
      } else {
        throw "User is not an admin";
      }
    })
    .then(doc => {
      console.debug("User deleted successfully");
      res.status(200).json({ user: doc });
    })
    .catch(err => {
      console.debug(err);
      res.status(500).json({ errorMessage: "Internal Server Error" });
    });
}

// admin read
adminRouter.get("/:userId/list_users", listAllUsers);

// admin delete
adminRouter.delete("/:userId/remove_user/:userIdToRemove", deleteUser);

module.exports = adminRouter;
