const express = require("express");
const productsRouter = express.Router();
const Product = require("../models/Product");
const User = require("../models/auth");

module.exports = function(contract) {
  // called when signup post request is made
  // use all porducts from flipkart for now
  async function getAllProducts(req, res, next) {
    // check if the user exists
    try {
      const userId = req.params.userId;

      const userObject = User.findOne({ _id: userId });

      if (userObject) {
        const products = await Product.find({}).sort({ _id: -1 });
        if (products) {
          return res.status(200).json({ products });
        } else {
          return res.status(404).json({ message: "No products yet to show" });
        }
      } else {
        res.status(401).json({ message: "Unauthorized operation." });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Failed to load products. Try again."
      });
    }
  }

  // called when login post request is made
  async function getAllPostsByCurrentUser(req, res, next) {
    const userId = req.params.userId;
    // TODO: use user object to access using one field
    try {
      const products = await Product.find({ createdBy: userId }).sort({
        _id: -1
      });

      if (products) {
        res.status(200).json({ products });
      } else {
        res.status(404).json({ message: "No products yet to show" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Failed to load products. Try again."
      });
    }
  }

  async function removeProductFromSale(req, res, next) {
    const userId = req.params.userId;
    const { productId } = req.body;

    try {
      const userObject = await User.findOne({ _id: userId });
      const loc = userObject.itemsForSale.indexOf(productId);

      if (loc !== -1) {
        userObject.itemsForSale.splice(loc, 1);
        const savedUser = await userObject.save();

        const product = await Product.findByIdAndDelete(productId);
        if (product) {
          return res
            .status(200)
            .json({ product, message: "Product deleted successfully" });
        }
        res.status(404).json({ message: "Product not found" });
      }
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Failed to remove the product! Try again" });
    }
  }

  async function addProductForSale(req, res, next) {
    const userId = req.params.userId;
    const { productName, retailPrice, numUnits } = req.body;

    let savedProduct;

    const newProduct = new Product({
      productName: productName,
      retailPrice: retailPrice,
      createdBy: userId,
      numUnits
    });
    try {
      const userObject = await User.findOne({ _id: userId });
      if (userObject) {
        const savedProduct = await newProduct.save();
        userObject.itemsForSale = userObject.itemsForSale || [];
        userObject.itemsForSale.push(savedProduct._id);

        const savedUser = await userObject.save();
        res.status(200).json({
          product: savedProduct,
          message: "Product successfully added"
        });
      } else {
        res.status(401).json({ message: "Not authorized." });
      }
    } catch (err) {
      console.debug(err);
      res
        .status(500)
        .json({ message: "Failed to save the product! Try again" });
    }
  }

  // Read
  productsRouter.route("/:userId/catalog").get(getAllProducts);
  // Read
  productsRouter.route("/by/:userId").get(getAllPostsByCurrentUser);
  // Create
  productsRouter.route("/:userId/addProductForSale").post(addProductForSale);
  // Delete
  productsRouter
    .route("/:userId/removeProductFromSale")
    .post(removeProductFromSale);

  return productsRouter;
};
