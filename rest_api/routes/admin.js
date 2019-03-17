const express = require("express");
const adminRouter = express.Router();
const Product = require("../models/Product");
const User = require("../models/auth");

const { signTx } = require("../helpers");

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

    if (userObject.isAdmin) {
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
  // TODO: delete the products the user posted too when deleting the user
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
    if (userObject.isAdmin) {
      const userToRemove = await User.findById(userIdToRemove);
      if (userToRemove) {
        try {
          let unregisterResult;
          try {
            console.debug(`Unregistering ${userObject.bcAddress}`);
            unregisterResult = await signTx(
              process.env.ADMIN_ADDRESS,
              process.env.CONTRACT_ADDRESS,
              process.env.PRIVATE_KEY,
              contract.methods.unregister(userToRemove.bcAddress).encodeABI()
            );
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

    if (userObject.isAdmin) {
      try {
        const result = await signTx(
          process.env.ADMIN_ADDRESS,
          process.env.CONTRACT_ADDRESS,
          process.env.PRIVATE_KEY,
          contract.methods.addTokens(rechargeAmount).encodeABI()
        );

        const stats = await __getTokenStats(userObject);

        if (!stats) {
          throw "Error in calling contract functions";
        }

        const { totalTokens, tokensRemaining } = stats;

        return res.status(200).json({
          totalTokens,
          tokensRemaining,
          message: "Successfully added tokens to the network"
        });
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Failed to add tokens. Try again" });
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

      console.debug(totalTokens);

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

    if (userObject.isAdmin) {
      try {
        const stats = await __getTokenStats(userObject);
        if (!stats) {
          throw "Error in calling contract functions";
        }
        const { totalTokens, tokensRemaining } = stats;

        res.status(200).json({ totalTokens, tokensRemaining });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          message: "Cannot retrieve token stats right now. Try again"
        });
      }
    } else {
      res.status(401).json({ message: "Unauthorized operation." });
    }
  }
  // TODO: Add deposit only when num tokens is >= deposit
  async function addDeposit(req, res, next) {
    const { requestedBy } = req.body;
    const rechargeAmount = parseInt(req.body.rechargeAmount);

    try {
      const userObject = await User.findOne({ _id: req.params.userId });

      const tokensRemaining = await contract.methods
        .getTokenBalance()
        .call({ from: userObject.bcAddress });

      if (tokensRemaining < rechargeAmount) {
        return res
          .status(401)
          .json({ message: "Insufficient tokens remaining. Deposit failed" });
      }

      let requestorObject;
      if (requestedBy) {
        requestorObject = await User.findOne({ _id: requestedBy });

        let userBcAddress;
        if (userObject) {
          userBcAddress = userObject.bcAddress;
          if (requestorObject && requestorObject.isAdmin) {
            fromAccount = requestorObject.bcAddress;
            const addDepositResult = await signTx(
              process.env.ADMIN_ADDRESS,
              process.env.CONTRACT_ADDRESS,
              process.env.PRIVATE_KEY,
              contract.methods
                .addDeposit(userBcAddress, rechargeAmount)
                .encodeABI()
            );

            if (addDepositResult) {
              userObject.accountBalance += rechargeAmount;

              await userObject.save();

              res.status(200).json({
                accountBalance: userObject.accountBalance,
                message: "Amount added to the wallet!!"
              });
            }
          } else {
            return res.status(404).json({ message: "Unauthorized request!!" });
          }
        } else {
          return res.status(401).json({
            message: "User not found"
          });
        }
      } else {
        res.status(401).json({ message: "Unauthorized request!!" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Network error!! Try again." });
    }
  }

  // admin read
  adminRouter.get("/:userId/list_users", listAllUsers);

  adminRouter.get("/:userId/get_token_stats", getTokenStats);

  adminRouter.post("/:userId/add_tokens", addTokens);

  adminRouter.post("/:userId/add_deposit", addDeposit);

  // admin delete
  adminRouter.delete("/:userId/remove_user/:userIdToRemove", deleteUser);

  return adminRouter;
};
