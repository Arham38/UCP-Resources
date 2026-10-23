const sql = require('mssql');

const config = {
  user: 'sa',                  // your SQL Server username
  password: '1234', // your SQL Server password
  server: 'localhost',          // or '127.0.0.1'
  database: 'stu',           // database you want to connect to
  options: {
    encrypt: false,             // for local SQL Server
    trustServerCertificate: true
  }
};

async function connectDB() {
  try {
    await sql.connect(config);
    console.log('Connected to SQL Server successfully!');
    
    
    const result = await sql.query`select *from students`;
    console.log(result.recordset);
    
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

connectDB();
