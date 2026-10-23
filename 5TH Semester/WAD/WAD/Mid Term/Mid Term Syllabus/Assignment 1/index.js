// index.js

const express = require("express");
const app = express();
const port = 3000;

const { books } = require("./data.js");

// Start server
app.listen(port, () => {
  console.log("Server is open now on port", port);
});

// 1 List of All Books
app.get("/api/books", (req, res) => {
  res.json(books);

});

// 2 List of Available Books
app.get("/api/books/available", (req, res) => {
  const availableBooks = books.filter(book => book.isAvailable === true);
  res.json(availableBooks);
});

// 3 List of Issued (Unavailable) Books
app.get("/api/books/issued", (req, res) => {
  const issuedBooks = books.filter(book => book.isAvailable === false);
  res.json(issuedBooks);
});

// 4 Find Books by Specific Author (Query Parameter)
app.get("/api/books/search", (req, res) => {
  const authorName = "Ray Khalid".toLowerCase();

  const search = authorName.toLowerCase();
  const matchedBooks = books.filter(book => book.author.toLowerCase().includes(search));

  if (matchedBooks.length > 0) {
    res.json(matchedBooks);
  } else {
    res.status(404).json({ message: "No books found for this author." });
  }
});




