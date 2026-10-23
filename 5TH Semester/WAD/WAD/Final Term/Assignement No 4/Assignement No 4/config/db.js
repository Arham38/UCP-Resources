const mongoose = require('mongoose');

const mongoURI="mongodb://localhost:27017/ASS4";

mongoose.connect(mongoURI);
const db = mongoose.connection;
db.on("connected", ()=>{
    console.log("Mongoose connected to db successfully");
});
db.on("error", (err)=>{
    console.log("Mongoose connection error:", err);
});
module.exports = db;