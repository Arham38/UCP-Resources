// models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookID: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  author: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true,
    enum: ["Fiction", "Science", "History", "Technology", "Biography", "Comics"]
  },
  publishedYear: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        return value >= 1900;
      },
      message: 'Published year must be 1900 or later.'
    }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
