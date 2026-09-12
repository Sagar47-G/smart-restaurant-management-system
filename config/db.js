const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://sagargsagar49_db_user:nHOVwUDwmKNqFlzp@cluster0.7mkhaxj.mongodb.net/?appName=resrorent");

        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;