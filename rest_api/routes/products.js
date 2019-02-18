const express = require("express");
const productsRouter = express.Router();
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
  // use user object to gte this faster
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

function removeProductFromSale(req, res, next) {
  const userId = req.params.userId;

  const { productId } = req.body;

  User.findOne({ _id: userId })
    .then(user => {
      const loc = user.itemsForSale.indexOf(productId);

      if (loc !== -1) {
        user.itemsForSale.splice(loc, 1);
        return user.save();
      }
      return user;
    })
    .then(user => Product.findByIdAndDelete(productId))
    .then(product => res.status(200).json({ product }))
    .catch(err => {
      console.debug(err);
      res
        .status(500)
        .json({ errorMessage: "Failed to remove the product! Try again" });
    });
}

function addProductForSale(req, res, next) {
  const userId = req.params.userId;
  const { productName, retailPrice, numUnits } = req.body;

  let savedProduct;

  const newProduct = new Product({
    product_name: productName,
    retail_price: retailPrice,
    createdBy: userId,
    numUnits
  });

  newProduct
    .save()
    .then(product => {
      savedProduct = product;
      return User.findOne({ _id: userId });
    })
    .then(user => {
      user.itemsForSale = user.itemsForSale || [];
      user.itemsForSale.push(savedProduct._id);
      return user.save();
    })
    .then(user => res.status(200).json({ product: savedProduct }))
    .catch(err => {
      console.debug(err);
      res
        .status(500)
        .json({ errorMessage: "Failed to save the product! Try again" });
    });
}

// Read
productsRouter.route("/catalog").get(getAllProducts);
// Read
productsRouter.route("/by/:userId").get(getAllPostsByCurrentUser);
// Create
productsRouter.route("/:userId/addProductForSale").post(addProductForSale);
// Delete
productsRouter
  .route("/:userId/removeProductFromSale")
  .post(removeProductFromSale);

module.exports = productsRouter;
