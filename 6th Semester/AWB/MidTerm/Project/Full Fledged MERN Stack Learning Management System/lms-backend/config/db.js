const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/LMS_Final_Project');

const db = mongoose.connection;

db.on('connected', () => {
  console.log('MongoDB connected successfully');
})
db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

module.exports = db;



