const express = require("express");
const regUserRouter = express.Router();
const Product = require("../models/Product");
const User = require("../models/auth");
const bcrypt = require("bcryptjs");

const { signTx } = require("../helpers");

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

  // TODO: remove hard-coded private key
  async function addDeposit(req, res, next) {
    const { password } = req.body;
    const rechargeAmount = parseInt(req.body.rechargeAmount);

    try {
      const userObject = await User.findOne({ _id: req.params.userId });

      if (userObject) {
        const userBcAddress = userObject.bcAddress;

        const result = await bcrypt.compare(password, userObject.password);
        if (result) {
          // all good, recharge wallet
          const addDepositResult = await signTx(
            userBcAddress,
            process.env.CONTRACT_ADDRESS,
            "<user's private key>",
            contract.methods
              .addDeposit(userBcAddress, rechargeAmount)
              .encodeABI()
          );

          if (addDepositResult) {
            userObject.accountBalance += rechargeAmount;

            const updatedUser = await userObject.save();

            res.status(200).json({
              accountBalance: updatedUser.accountBalance,
              message: "Amount added to the wallet!!"
            });
          }
        } else {
          return res
            .status(401)
            .json({ message: "Your credentials are incorrect. Try again." });
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Network error!! Try again." });
    }
  }

  // TODO: remove hard-coded private key
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

      if (buyer.accountBalance < retailPrice) {
        return res
          .status(401)
          .json({ message: "Insufficient account balance. Please recharge" });
      }

      let transactionId;

      try {
        const result = await signTx(
          buyer.bcAddress,
          process.env.CONTRACT_ADDRESS,
          "<user's private key>",
          contract.methods.buy(retailPrice, seller.bcAddress).encodeABI()
        );
      } catch (err) {
        console.error(err);
        return res.status(500).json({
          message: "Transaction failed!!"
        });
      }

      buyer.accountBalance = buyer.accountBalance - retailPrice;
      seller.accountBalance = seller.accountBalance + retailPrice;

      buyer.purchases.push({
        productId: productToBuy._id,
        boughtFrom: seller._id
      });

      seller.sales.push({
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
    console.debug("end of function");
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
