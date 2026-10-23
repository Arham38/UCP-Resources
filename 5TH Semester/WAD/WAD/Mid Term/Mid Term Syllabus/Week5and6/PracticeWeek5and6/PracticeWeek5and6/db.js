
const mongoose = require('mongoose');
const mongoURL = 'mongodb://localhost:27017/UCP' //take this url from campass localhost ...
mongoose.connect(mongoURL)
const db = mongoose.connection //builten function to stable connection
db.on('connected',()=>{console.log('MongoDB is connected')})
db.on('error',()=>{console.log('MongoDB connection errOR')})
db.on('disconnected',()=>{console.log('MongoDB is didconnected')})
module.exports = db

// npm install mongoose
// npm install mongodb

