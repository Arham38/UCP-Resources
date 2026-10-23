const sql = require('mssql');
require('./db');


// ✅ CREATE (Insert)
exports.createStudent = async (req, res) => {
  await sql.query`
    INSERT INTO students (name, age, department)
    VALUES (${req.body.name}, ${req.body.age}, ${req.body.department})
  `;
  res.send("Student created");
};


// ✅ READ (Select)
exports.getStudents = async (req, res) => {
  const result = await sql.query`SELECT * FROM students`;
  res.json(result.recordset);
};


// ✅ UPDATE
exports.updateStudent = async (req, res) => {
  await sql.query`
    UPDATE students
    SET name=${req.body.name},
        age=${req.body.age},
        department=${req.body.department}
    WHERE id=${req.params.id}
  `;
  res.send("Student updated");
};


// ✅ DELETE
exports.deleteStudent = async (req, res) => {
  await sql.query`
    DELETE FROM students WHERE id=${req.params.id}
  `;
  res.send("Student deleted");
};
