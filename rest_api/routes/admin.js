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
        return Promise.reject("Unauthorized operation.");
      }
    })
    .then(
      users => res.status(200).json({ users }),
      reason => res.status(401).json({ message: reason })
    )
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    });
}

function deleteUser(req, res, next) {
  const { userId, userIdToRemove } = req.params;

  User.findOne({ _id: userId })
    .then(user => {
      if (user.isAdmin) {
        return User.findByIdAndDelete(userIdToRemove);
      } else {
        return Promise.reject("Unauthorized operation.");
      }
    })
    .then(
      doc => {
        if (doc) {
          console.debug("User deleted successfully");
          res
            .status(200)
            .json({ user: doc, message: "User deleted successfully" });
        } else {
          res.status(404).json({ message: "User to delete not found" });
        }
      },
      reason => reason.status(401).json({ message: reason })
    )
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
}

// admin read
adminRouter.get("/:userId/list_users", listAllUsers);

// admin delete
adminRouter.delete("/:userId/remove_user/:userIdToRemove", deleteUser);

module.exports = adminRouter;
