const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    tableNo: String,

    items: [
        {
            name: String,
            price: Number
        }
    ],

    totalAmount: Number,

    status: {
        type: String,
        default: "Received"
    }
});

module.exports = mongoose.model("Order", orderSchema);