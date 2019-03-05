const express = require("express");
const adminRouter = express.Router();
const Product = require("../models/Product");
const User = require("../models/auth");

module.exports = function(contract) {
  async function listAllUsers(req, res, next) {
    const userId = req.params.userId;

    let userObject;
    try {
      userObject = await User.findOne({ _id: userId });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Network error. Try again" });
    }

    if (userObject.accountType === "admin") {
      try {
        const listOfUsers = await User.find({})
          .where("_id")
          .ne(userId);
        res.status(200).json({ users: listOfUsers });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Network error. Try again" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized operation." });
    }
  }

  async function deleteUser(req, res, next) {
    const { userId, userIdToRemove } = req.params;

    let userObject;
    try {
      userObject = await User.findOne({ _id: userId });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Network error, try again" });
    }

    let deleteObject;
    if (userObject.accountType === "admin") {
      const userToRemove = await User.findById(userIdToRemove);
      if (userToRemove) {
        try {
          let unregisterResult;
          try {
            console.debug(`Unregistering ${userObject.bcAddress}`);
            unregisterResult = await contract.methods
              .unregister(userToRemove.bcAddress)
              .send({ from: process.env.ADMIN_ADDRESS, gas: 100000 });
          } catch (err) {
            console.error(err);
            return res
              .status(500)
              .json({ message: "Blockchain error!! Try again." });
          }

          if (unregisterResult) {
            deleteObject = await User.findByIdAndDelete(userIdToRemove);

            if (deleteObject) {
              console.debug("User deleted successfully");
              res.status(200).json({
                user: deleteObject,
                message: "User deleted successfully"
              });
            } else {
              res.status(404).json({ message: "User to delete not found" });
            }
          }
        } catch (err) {
          console.error(err);
          return res.status(500).json({ message: "Network error, try again" });
        }
      } else {
        res.status(401).json({ message: "Unauthorized operation." });
      }
    }
  }

  // admin read
  adminRouter.get("/:userId/list_users", listAllUsers);

  // admin delete
  adminRouter.delete("/:userId/remove_user/:userIdToRemove", deleteUser);

  return adminRouter;
};
