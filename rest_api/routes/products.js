const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcryptjs");
const Product = require("../models/Product");

// called when signup post request is made
// use all porducts from flipkart for now
function getAllProducts(req, res, next) {
  // check if the user exists
  Product.find({}).then(function(docs) {
    // if user exists call reject else register the user
    res.status(200).json({products: docs});
  })
  .catch(function(err){
    console.debug(err);
    res.status(500).json({errorMessage: "Internal server error"});
  });
}

// called when login post request is made
function getAllPostsByCurrentUser(req, res, next) {
  const userId = req.params.userId;
  
  Product.find({createdBy: userId})
    .then((docs) => {
  
      res.status(200).json({products: docs});
    })
    .catch((err) => {
      console.debug(err);
      res.status(500).json({errorMessage: "Internal server error"})
    });
}

authRouter.route("/catalog").get(getAllProducts);

authRouter.route("/userPosts/:userId").get(getAllPostsByCurrentUser);

module.exports = authRouter;
