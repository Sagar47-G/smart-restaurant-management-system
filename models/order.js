const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    tableNo: Number,

    items: Array,

    totalAmount: Number,

    status: {
        type: String,
        default: "Received"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);