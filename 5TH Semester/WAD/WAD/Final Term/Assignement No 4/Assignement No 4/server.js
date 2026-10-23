const express = require('express');
const db= require('./config/db');
const usersRouter = require('./routes/user.routes');
const projectsRouter = require('./routes/project.routes');
const app = express();
const port = 3000;
app.use(express.json());
app.use('/api/user', usersRouter);
app.use('/api/project', projectsRouter);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
