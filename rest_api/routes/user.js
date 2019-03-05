const express = require("express");
const regUserRouter = express.Router();
const Product = require("../models/Product");
const User = require("../models/auth");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

module.exports = function(contract) {
  async function getCart(req, res, next) {
    const userId = req.params.userId;

    const userObject = await User.findOne({ _id: userId });
    try {
      if (!userObject.cart) {
        res.status(200).json({ products: [] });
      } else {
        const products = await Product.find({ _id: { $in: userObject.cart } });
        res.status(200).json({ products });
      }
    } catch (err) {
      console.debug(err);
      res.status(500).json({ message: "Network error, try again" });
    }
  }

  function changeCart(operation) {
    return async function(req, res, next) {
      const userId = req.params.userId;
      const productId = req.body.productId;

      try {
        const productObject = await Product.findOne({ _id: productId });

        if (!productObject) {
          return res
            .status(404)
            .json({ message: "Product with the given ID doesn't exist" });
        }

        const userObject = await User.findOne({ _id: userId });

        if (!userObject.cart) {
          userObject.cart = [];
        }

        if (operation === "add") {
          if (userObject.cart.indexOf(productId) === -1) {
            userObject.cart.push(productId);
            await userObject.save();
          } else {
            return res
              .status(404)
              .json({ message: "Product already added to the cart" });
          }
        } else if (operation === "remove") {
          const loc = userObject.cart.indexOf(productId);

          if (loc !== -1) {
            userObject.cart.splice(loc, 1);
            await userObject.save();
          } else {
            return res
              .status(404)
              .json({ message: "Product to remove not found" });
          }
        }

        res
          .status(200)
          .json({ product: productObject, message: "Added to cart" });
      } catch (err) {
        console.debug(err);
        res.status(500).json({ message: "Network error!! Try again" });
      }
    };
  }

  async function getPurchases(req, res, next) {
    const { userId } = req.params;

    try {
      const userObject = await User.findOne({ _id: userId });

      if (userObject) {
        const productIds = userObject.purchases.map(
          purchase => purchase.productId
        );

        const purchases = await Product.find({ _id: { $in: productIds } });

        res.status(200).json({ products: purchases || [] });
      } else {
        res.status(401).json({ message: "Unauthorized operation." });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Netwrok error. Try again!" });
    }
  }

  // this request should only come from admin or the same user
  async function addDeposit(req, res, next) {
    const { password, requestedBy } = req.body;
    const rechargeAmount = parseInt(req.body.rechargeAmount);

    try {
      const userObject = await User.findOne({ _id: req.params.userId });

      let requestorObject;
      if (requestorObject) {
        requestorObject = await User.findOne({ _id: requestedBy });
      }
      let userBcAddress;
      if (userObject) {
        userBcAddress = userObject.bcAddress;
        if (requestorObject && requestorObject.accountType === "admin") {
          fromAccount = requestorObject.bcAddress;
        } else {
          const result = await bcrypt.compare(password, userObject.password);
          if (result) {
            // all good, recharge wallet
            fromAccount = userBcAddress;
          } else {
            return res
              .status(401)
              .json({ message: "Your credentials are incorrect. Try again." });
          }
        }

        const addDepositResult = await contract.methods
          .addDeposit(userBcAddress, rechargeAmount)
          .send({
            from: fromAccount,
            gas: 300000
          });

        if (addDepositResult) {
          userObject.accountBalance += rechargeAmount;

          await userObject.save();

          res.status(200).json({
            accountBalance: userObject.accountBalance,
            message: "Amount added to the wallet!!"
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

  // this is gonna be huge
  // this later would handle transaction between buyer and seller, for now it just decrements counter
  async function buyProduct(req, res, next) {
    const productId = req.body.productId;
    const buyerId = req.params.userId;

    // check if in stock

    try {
      const productToBuy = await Product.findOne({ _id: productId })
        .where("numUnits")
        .ne(0);

      if (!productToBuy) {
        return res
          .status(404)
          .json({ message: "Product not found or out of stock" });
      }

      const buyer = await User.findOne({ _id: buyerId });

      if (!buyer) {
        return res.status(404).json({ message: "Buyer's user Id not found" });
      }

      const seller = await User.findOne({ _id: productToBuy.createdBy });

      if (!seller) {
        return res.status(404).json({ message: "Seller's user Id not found" });
      }

      const retailPrice = parseInt(productToBuy.retailPrice);
      // for now return tx

      let transactionId;

      try {
        transactionId = await contract.methods
          .buy(productToBuy._id.toString(), retailPrice, seller.bcAddress)
          .send({
            from: buyer.bcAddress,
            gas: 200000
          });
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json({
            message: "Insufficient account balance. Transaction failed!!"
          });
      }
      transactionId = transactionId.toString();
      console.debug(transactionId);

      buyer.purchases.push({
        transactionId,
        productId: productToBuy._id,
        boughtFrom: seller._id
      });

      seller.sales.push({
        transactionId,
        productId: productToBuy._id,
        soldTo: seller._id
      });
      productToBuy.numUnits -= 1;
      // console.debug(productToBuy.numUnits);
      const buyerObj = await buyer.save();
      const sellerObj = await seller.save();
      const productObj = await productToBuy.save();

      if (buyerObj && sellerObj && productObj) {
        return res.status(200).json({
          product: productObj,
          message: "Congrats!! You bought the product"
        });
      }
      res.status(500).json({ message: "Transaction failed. Contact admin" });
    } catch (err) {
      console.debug(err);
      res.status(500).json({ message: "Transaction failed. Contact admin" });
    }
  }

  // user cart Read
  regUserRouter.get("/:userId/cart", getCart);

  // user purchases
  regUserRouter.get("/:userId/purchases", getPurchases);

  // recharge wallet
  regUserRouter.post("/:userId/add_deposit", addDeposit);

  // user cart create
  regUserRouter.post("/:userId/cart/add", changeCart("add"));

  // user cart delete
  regUserRouter.post("/:userId/cart/remove", changeCart("remove"));

  // user buy
  regUserRouter.post("/:userId/buy", buyProduct);

  return regUserRouter;
};
