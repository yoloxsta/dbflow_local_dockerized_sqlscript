const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Database configuration
const dbConfig = {
  host: 'mysql-db',  // MySQL service name in docker-compose
  user: 'root',
  password: 'yngWIE500',
  database: 'simple_project',
};

let db;

// Retry connection mechanism
function connectToDb() {
  db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      console.error('Database connection failed:', err);
      setTimeout(connectToDb, 5000);  // Retry after 5 seconds
    } else {
      console.log('Connected to the database.');
    }
  });
}

// Call the connection function
connectToDb();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle form submission
app.post('/submit', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send('Name is required.');
  }

  const query = 'INSERT INTO users (name) VALUES (?)';
  db.query(query, [name], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Database error.');
    }
    res.status(200).send('Data inserted successfully.');
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
