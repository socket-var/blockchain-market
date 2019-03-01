const express = require("express");
const regUserRouter = express.Router();
const Product = require("../models/Product");
const User = require("../models/auth");

const mongoose = require("mongoose");

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

    const transactionId = mongoose.Types.ObjectId();
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
    res.status(500).json("Transaction failed. Contact admin");
  } catch (err) {
    console.debug(err);
    res.status(500).json({ message: err });
  }
}

// user cart Read
regUserRouter.get("/:userId/cart", getCart);

// user cart create
regUserRouter.post("/:userId/cart/add", changeCart("add"));

// user cart delete
regUserRouter.post("/:userId/cart/remove", changeCart("remove"));

// user buy
regUserRouter.post("/:userId/buy", buyProduct);

module.exports = regUserRouter;
