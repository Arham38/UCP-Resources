const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Member = require('../models/Member');


/*  Add a new book */
router.post('/books', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json({ message: 'Book added successfully', book });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/*  Add a new member */
router.post('/members', async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json({ message: 'Member added successfully', member });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/*  Fetch all books */
router.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*  Fetch all members */
router.get('/members', async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*  Fetch available books (supports query filters) */
router.get('/books/available', async (req, res) => {
  try {
    const { genre, publishedYear } = req.query;
    const filter = { isAvailable: true };
    if (genre) filter.genre = genre;
    if (publishedYear) filter.publishedYear = Number(publishedYear);

    const books = await Book.find(filter);
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*  Fetch issued books */
router.get('/books/issued', async (req, res) => {
  try {
    const books = await Book.find({ isAvailable: false }).select('title');
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*  Fetch books by genre */
router.get('/books/genre/:type', async (req, res) => {
  try {
    const books = await Book.find({ genre: req.params.type });
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*  Fetch recent members (joined in last 60 days) */
router.get('/members/recent', async (req, res) => {
  try {
    const date = new Date();
    date.setDate(date.getDate() - 60);
    const members = await Member.find({ joinedDate: { $gte: date } });
    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*  Fetch members by role */
router.get('/members/role/:role', async (req, res) => {
  try {
    const members = await Member.find({ role: req.params.role.toLowerCase() });
    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
