const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const lmsRoutes = require('./routes/lmsRoutes');

const app = express();
app.use(bodyParser.json());

//  Connect MongoDB
connectDB();

// LMS Routes
app.use('/lms', lmsRoutes);

// Root test route
app.get('/', (req, res) => {
  res.send(' Library Management System API Running...');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
