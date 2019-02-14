const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_name: String,
  retail_price: Number,
  createdBy: String
});

module.exports = mongoose.model("Product", productSchema);
