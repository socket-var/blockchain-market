const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  cart: Array,
  itemsForSale: Array,
  isAdmin: Boolean
});

module.exports = mongoose.model("User", userSchema);
