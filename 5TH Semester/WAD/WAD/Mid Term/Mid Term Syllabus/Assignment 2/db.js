const mongoose = require("mongoose");


const mongoURL = "mongodb://localhost:27017/L1F23BSSE0372";




mongoose.connection.on("connected", () => {
  console.log(" Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.log(" Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log(" Mongoose disconnected");
});

module.exports = connectDB;
