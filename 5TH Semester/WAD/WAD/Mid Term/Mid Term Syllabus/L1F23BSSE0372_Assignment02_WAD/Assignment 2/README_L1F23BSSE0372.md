Library Management System API (Assignment 02)

Course Code: SESE3143
Semester: Fall 2025
Student Name: Muhammad Arham 
Registration Number: L1F23BSSE0372
Date: November 08, 2025

📘 Project Overview

This project is a RESTful API for managing books and members in a Library Management System (LMS).
It is built using Node.js, Express.js, MongoDB, and Mongoose.
The API allows librarians and faculty to perform CRUD operations and fetch data efficiently.

⚙️ Installation & Setup
1️⃣ Clone or Extract Project

Download or clone the repository to your local system and open it in VS Code or your preferred editor.

2️⃣ Install Dependencies

Run the following command to install all required packages:

npm install express mongoose body-parser nodemon

3️⃣ Configure Database

Ensure MongoDB Compass or MongoDB Server is running on your machine.
Database name: L1F23BSSE0372 (as per registration number).

4️⃣ Start Server

Use one of the following commands:

npm start


or

nodemon server.js


Server runs by default on:

http://localhost:3000/

🧠 API Endpoints Summary
Method	Endpoint	Description
POST	/lms/books	Add a new book
POST	/lms/members	Add a new member
GET	/lms/books	Fetch all books
GET	/lms/members	Fetch all members
GET	/lms/books/available	Fetch available books
GET	/lms/books/issued	Fetch issued books
GET	/lms/books/genre/:type	Fetch books by genre
GET	/lms/members/recent	Fetch members joined in last 60 days
GET	/lms/members/role/:role	Fetch members by specific role
GET	/lms/books/available?genre=Science&publishedYear=2022	Filtered available books
🧩 Example Book Schema (Book.js)
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookID: { type: Number, required: true, unique: true },
  title: { type: String, required: true, maxlength: 200 },
  author: { type: String, required: true },
  genre: { 
    type: String, 
    required: true, 
    enum: ["Fiction", "Science", "History", "Technology", "Biography", "Comics"] 
  },
  publishedYear: { type: Number, required: true, min: 1900 },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);

🧩 Example Member Schema (Member.js)
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  memberID: { type: Number, required: true, unique: true },
  name: { type: String, required: true, minlength: 5 },
  email: { type: String, required: true, unique: true },
  department: { type: String },
  joinedDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  role: { type: String, required: true, enum: ["student", "faculty"] },
  gender: { type: String }
});

module.exports = mongoose.model('Member', memberSchema);

🧪 Testing with Postman

Open Postman.

Set the API base URL to: http://localhost:3000/lms

Test all routes one by one (POST, GET).

Insert screenshots in your Word documentation file
(Library_API_Endpoints_L1F23BSSE0372.docx).

📤 Submission Package Includes

server.js

db.js

package.json

models/Book.js

models/Member.js

Library_API_Endpoints_L1F23BSSE0372.docx

README_L1F23BSSE0372.md

Zip the entire folder and upload it to the UCP Portal.

🧾 Notes

Handle all errors using try-catch.

Return responses in JSON format.

Use appropriate HTTP Status Codes (200, 404, 500).

Follow Express best practices and comment your code clearly.