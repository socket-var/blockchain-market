const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  cart: Array,
  itemsForSale: Array
});

module.exports = mongoose.model("User", userSchema);
