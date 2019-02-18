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
      if (docs) {
        res.status(200).json({ products: docs });
      } else {
        res.status(404).json({ message: "No products yet to show" });
      }
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).json({
        message: "Failed to load products. Try again."
      });
    });
}

// called when login post request is made
function getAllPostsByCurrentUser(req, res, next) {
  const userId = req.params.userId;
  // TODO: use user object to access using one field
  Product.find({ createdBy: userId })
    .sort({ _id: -1 })
    .then(docs => {
      if (docs) {
        res.status(200).json({ products: docs });
      } else {
        res.status(404).json({ message: "No products yet to show" });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        message: "Failed to load products. Try again."
      });
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
    .then(product => {
      if (product) {
        res
          .status(200)
          .json({ product, message: "Product deleted successfully" });
      }
      res.status(404).json({ message: "Product not found" });
    })
    .catch(err => {
      console.error(err);
      res
        .status(500)
        .json({ message: "Failed to remove the product! Try again" });
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
    .then(user =>
      res
        .status(200)
        .json({ product: savedProduct, message: "Product successfully added" })
    )
    .catch(err => {
      console.debug(err);
      res
        .status(500)
        .json({ message: "Failed to save the product! Try again" });
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
