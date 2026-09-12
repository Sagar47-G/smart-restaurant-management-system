// models/Feedback.js
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    customerName: String,
    rating: Number,
    comment: String
});

module.exports = mongoose.model("feedback", feedbackSchema);