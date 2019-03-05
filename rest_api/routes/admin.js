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

  async function addTokens(req, res, next) {
    const { rechargeAmount } = req.body;
    const { userId } = req.params;

    let userObject;
    try {
      userObject = await User.findOne({ _id: userId });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Network error, try again" });
    }

    if (userObject.accountType == "admin") {
      try {
        const result = await contract.methods
          .addTokens(rechargeAmount)
          .send({ from: userObject.bcAddress, gas: 200000 });

        const stats = await __getTokenStats(userObject);

        if (!stats) { throw "Error in calling contract functions"; }

        const { totalTokens, tokensRemaining } = stats;

        return res
          .status(200)
          .json({
            totalTokens,
            tokensRemaining,
            message: "Successfully added tokens to the network"
          });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error!! Try again" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized operation" });
    }
  }

  async function __getTokenStats(userObject) {
    try {
      const totalTokens = await contract.methods
        .totalSupply()
        .call({ from: userObject.bcAddress });

      const tokensRemaining = await contract.methods
        .getTokenBalance()
        .call({ from: userObject.bcAddress });

      return { totalTokens, tokensRemaining };
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function getTokenStats(req, res, next) {

    const { userId } = req.params;

    let userObject;
    try {
      userObject = await User.findOne({ _id: userId });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Network error, try again" });
    }

    if (userObject.accountType == "admin") {
      try {
        const stats = await __getTokenStats(userObject);
        if (!stats) {
          throw "Error in calling contract functions";
        }
        const { totalTokens, tokensRemaining } = stats;

        res.status(200).json({ totalTokens, tokensRemaining });
      } catch (err) {
        console.error(err);
        res
          .status(500)
          .json({ message: "Cannot retrieve token stats right now. Try again" });
      }
    } else {
      res.status(401).json({message: "Unauthorized operation."});
    }
    
  }

  // admin read
  adminRouter.get("/:userId/list_users", listAllUsers);

  adminRouter.get("/:userId/get_token_stats", getTokenStats);

  adminRouter.post("/:userId/add_tokens", addTokens);

  // admin delete
  adminRouter.delete("/:userId/remove_user/:userIdToRemove", deleteUser);

  return adminRouter;
};
