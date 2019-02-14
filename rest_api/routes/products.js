const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcryptjs");
const Product = require("../models/Product");

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

authRouter.route("/catalog").get(getAllProducts);

authRouter.route("/userPosts/:userId").get(getAllPostsByCurrentUser);

authRouter.route("/addProduct").post(addNewProduct);

module.exports = authRouter;
