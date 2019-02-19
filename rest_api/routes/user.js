const express = require("express");
const regUserRouter = express.Router();
const Product = require("../models/Product");
const User = require("../models/auth");

const mongoose = require("mongoose");

function getCart(req, res, next) {
  const userId = req.params.userId;

  User.findOne({ _id: userId })
    .then(user => {
      if (!user.cart) {
        return [];
      } else {
        return Product.find({ _id: { $in: user.cart } });
      }
    })
    .then(docs => {
      res.status(200).json({ products: docs });
    })
    .catch(err => {
      console.debug(err);
      res.status(500).json({ errorMessage: "Internal Server Error" });
    });
}

function changeCart(operation) {
  return function(req, res, next) {
    const userId = req.params.userId;
    const productId = req.body.productId;
    let user;

    User.findOne({ _id: userId })
      .then(retUser => {
        user = retUser;
        if (!user.cart) {
          user.cart = [];
        }
        if (operation === "add") {
          if (user.cart.indexOf(productId) === -1) {
            user.cart.push(productId);
            return user.save();
          }
          return user;
        } else if (operation === "remove") {
          const loc = user.cart.indexOf(productId);

          if (loc !== -1) {
            user.cart.splice(loc, 1);
            return user.save();
          }
          return user;
        }
      })
      .then(doc => {
        console.debug(doc, "success saving to cart");
        res.status(200).json({ product: doc, message: "Added to cart" });
      })
      .catch(err => {
        console.debug(err);
        res.status(500).json({ message: "Internal Server Error" });
      });
  };
}

// this is gonna be huge
// this later would handle transaction between buyer and seller, for now it just decrements counter
function buyProduct(req, res, next) {
  const productId = req.body.productId;
  const buyerId = req.params.userId;
  let productToBuy;
  let buyer;
  let seller;
  // check if in stock
  Product.findOne({ _id: productId })
    .where("numUnits")
    .ne(0)
    .then(product => {
      console.debug(product.numUnits);
      if (!product) {
        throw "Product not found or out of stock";
      }
      productToBuy = product;
      return User.findOne({ _id: buyerId });
    })
    .then(user => {
      if (!user) {
        throw "Buy failed 1!!";
      }
      buyer = user;
      console.debug(productToBuy.createdBy);
      return User.findOne({ _id: productToBuy.createdBy });
    })
    .then(user => {
      if (!user) {
        throw "Buy failed 2!!";
      }
      seller = user;

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
      return Promise.all([buyer.save(), seller.save(), productToBuy.save()]);
    })
    .then(([buyerObj, sellerObj, productObj]) => {
      if (buyerObj && sellerObj && productObj) {
        return res.status(200).json({
          product: productObj,
          message: "Congrats!! You bought the product"
        });
      }
      throw "Buy failed 3!!";
    })
    .catch(reason => {
      console.debug(reason);
      res.status(404).json({ message: reason });
    });
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
