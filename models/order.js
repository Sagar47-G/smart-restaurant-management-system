const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    tableNo: String,
    items: Array,
    totalAmount: Number,
    status: {
        type: String,
        default: 'Received'
    }
});

module.exports = mongoose.model("Order", orderSchema);