// models/Bill.js
const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
    orderId: String,
    totalAmount: Number,
    paymentStatus: {
        type: String,
        default: "Pending"
    }
});

module.exports = mongoose.model("bill", billSchema);