const express = require("express");
const productsRouter = express.Router();
const bcrypt = require("bcryptjs");
const Product = require("../models/Product");
const User = require("../models/auth");

// called when signup post request is made
// use all porducts from flipkart for now
function getAllProducts(req, res, next) {
  // check if the user exists
  Product.find({})
    .sort({ _id: -1 })
    .then(function(docs) {
      // if user exists call reject else register the user
      res.status(200).json({ products: docs });
    })
    .catch(function(err) {
      err;
      res.status(500).json({ errorMessage: "Internal server error" });
    });
}

// called when login post request is made
function getAllPostsByCurrentUser(req, res, next) {
  const userId = req.params.userId;

  Product.find({ createdBy: userId })
    .sort({ _id: -1 })
    .then(docs => {
      res.status(200).json({ products: docs });
    })
    .catch(err => {
      err;
      res.status(500).json({ errorMessage: "Internal server error" });
    });
}

function addNewProduct(req, res, next) {
  const { productName, retailPrice, createdBy } = req.body;

  const newProduct = new Product({
    product_name: productName,
    retail_price: retailPrice,
    createdBy
  });

  newProduct.save((err, product) => {
    if (err) {
      res
        .status(500)
        .json({ errorMessage: "Failed to save the product! Try again" });
    }
    res.status(200).json({ product });
  });
}

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

function addToCart(req, res, next) {
  const userId = req.params.userId;
  const productId = req.body.productId;

  let user;

  User.findOne({ _id: userId })
    .then(retUser => {
      user = retUser;
      if (!user.cart) {
        user.cart = [];
      }
      if (user.cart.indexOf(productId) === -1) {
        user.cart.push(productId);
        return user.save();
      }
      return user;
    })
    .then(doc => {
      console.debug(doc, "success saving to cart");
      res.status(200).json({ product: doc });
    })
    .catch(err => {
      console.debug(err);
      res.status(500).json({ errorMessage: "Internal Server Error" });
    });
}

productsRouter.route("/catalog").get(getAllProducts);

productsRouter.route("/userPosts/:userId").get(getAllPostsByCurrentUser);

productsRouter.route("/addProduct").post(addNewProduct);

productsRouter.get("/:userId/cart", getCart);

productsRouter.post("/:userId/cart/add", addToCart);

module.exports = productsRouter;
