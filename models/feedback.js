const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    tableNo: Number,
    rating: Number,
    comment: String
});

module.exports = mongoose.model("Feedback", feedbackSchema);