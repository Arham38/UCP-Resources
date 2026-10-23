const mongoose = require("mongoose");

const mongoUrl = "mongodb://localhost:27017/practices";

mongoose.connect(mongoUrl)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
    });

const db = mongoose.connection;

db.on("connected", () => {
    console.log("Mongoose connection open");
});

db.on("error", (err) => {
    console.error("Mongoose connection error:", err);
});

db.on("disconnected", () => {
    console.log("Mongoose disconnected");
});

module.exports = db;
