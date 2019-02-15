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
        res.status(200).json({ product: doc });
      })
      .catch(err => {
        console.debug(err);
        res.status(500).json({ errorMessage: "Internal Server Error" });
      });
  };
}

// this is gonna be huge
// this later would handle transaction between buyer and seller, for now it just decrements counter
function buyProduct(req, res, next) {
  const productId = req.body.productId;
  // check if in stock
  Product.findOne({ _id: productId })
    .where("numUnits")
    .ne(0)
    .then(product => {
      console.debug(product.numUnits);
      if (!product) {
        throw "Not in stock";
      }
      // this should be async when things get real
      console.debug("decrementing numUnits");
      product.numUnits -= 1;
      console.debug(product.numUnits);
      return Promise.resolve(product);
    })
    .then(product => product.save())
    .then(product => {
      res.status(200).json({ product });
    })
    .catch(err => {
      console.debug(err);
      res.status(500).json({ errorMessage: "Internal Server Error" });
    });
}

productsRouter.route("/catalog").get(getAllProducts);

productsRouter.route("/userPosts/:userId").get(getAllPostsByCurrentUser);

productsRouter.route("/:userId/addProductForSale").post(addProductForSale);

productsRouter
  .route("/:userId/removeProductFromSale")
  .post(removeProductFromSale);

productsRouter.get("/:userId/cart", getCart);

productsRouter.post("/:userId/cart/add", changeCart("add"));

productsRouter.post("/:userId/cart/remove", changeCart("remove"));

productsRouter.post("/:userId/buy", buyProduct);

module.exports = productsRouter;
