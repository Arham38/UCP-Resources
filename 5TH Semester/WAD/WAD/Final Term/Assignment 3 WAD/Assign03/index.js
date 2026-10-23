const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");

require("./db");

const Person = require("./models/person");
const Book = require("./models/book");

const app = express();

app.use(bodyParser.json());

app.use(session({
  secret: "library_secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}
app.listen(3000, () => {
  console.log("Server running on port 3000");
});


app.post("/register", async (req, res) => {
  try {
    const user = new Person(req.body);
    await user.save();
    res.json({ message: "User Registered Successfully" });
  } catch {
    res.status(400).json({ message: "Registration Failed" });
  }
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Login Successful" });
});

app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.post("/books", isAuthenticated, async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.json({ message: "Book Added Successfully" });
  } catch {
    res.status(400).json({ message: "Error Adding Book" });
  }
});


