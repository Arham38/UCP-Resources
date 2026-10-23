// models/Member.js
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  memberID: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    minlength: 5
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    default: null 
  },
  joinedDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    required: true,
    enum: ["student", "faculty"]
  },
  gender: {
    type: String,
    default: null 
  }
});

// Create the model
const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
