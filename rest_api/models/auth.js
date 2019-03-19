const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  bcAddress: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cart: Array,
  itemsForSale: Array,
  isAdmin: { type: Boolean, default: false },
  purchases: [{ transactionId: String, productId: String, boughtFrom: String }],
  sales: [{ transactionId: String, productId: String, soldTo: String }],
  accountBalance: { type: Number, default: 0 },
  encryptedPk: { type: String, required: true }
});

module.exports = mongoose.model("User", userSchema);
