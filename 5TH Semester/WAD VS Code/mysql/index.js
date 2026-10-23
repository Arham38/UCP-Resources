const express = require('express');
const app = express();
const ctrl = require('./studentController');

app.use(express.json());

// CRUD Routes
app.post('/students', ctrl.createStudent);     // CREATE
app.get('/students', ctrl.getStudents);        // READ
app.put('/students/:id', ctrl.updateStudent);  // UPDATE
app.delete('/students/:id', ctrl.deleteStudent); // DELETE

app.listen(3000, () => {
  console.log('🚀 Server running on port 3000');
});
