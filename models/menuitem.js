const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
    name: String,
    price: Number
});

module.exports = mongoose.model("MenuItem", menuItemSchema);