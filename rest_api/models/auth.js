const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  bcAddress: String,
  email: String,
  password: String,
  cart: Array,
  itemsForSale: Array,
  isAdmin: Boolean,
  purchases: [{ transactionId: String, productId: String, boughtFrom: String }],
  sales: [{ transactionId: String, productId: String, soldTo: String }]
});

module.exports = mongoose.model("User", userSchema);
