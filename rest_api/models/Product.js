const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    // email: String,
    // password: String
});

module.exports = mongoose.model("Product", productSchema);