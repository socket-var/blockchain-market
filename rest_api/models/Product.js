const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: String,
  retailPrice: Number,
  createdBy: String,
  numUnits: Number,
  image: [String]
});

module.exports = mongoose.model("Product", productSchema);
