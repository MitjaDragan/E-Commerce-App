const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const saltRounds = 10; // or another number you prefer

// Middleware to parse JSON data
app.use(express.json());

// Database client setup
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce',
  password: 'Delta#2023!',
  port: 5432,
});

// Connect to the database
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database!");
});

// Hello World route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './', 'registration.html'));
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // Input validation
    if (!email || !password || !name || !address) {
      return res.status(400).send('Missing required fields');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into the database
    const query = 'INSERT INTO customers (name, email, password, address) VALUES ($1, $2, $3, $4)';
    await client.query(query, [name, email, hashedPassword, address]);
    res.status(201).send('User registered successfully');
  } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).send('Error during registration');
    }
});


// User login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }
    // Query the database for the user
    const userResult = await client.query('SELECT * FROM customers WHERE email = $1', [email]);

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];

      // Compare the provided password with the stored hash
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        // Passwords match
        res.send('Login successful');
      } else {
        // Passwords don't match
        res.status(400).send('Invalid password');
      }
    } else {
      // User not found
      res.status(404).send('User not found');
    }
  } catch (error) {
      console.error('Login error', error);
      res.status(500).send('Error during login');
  }
});






// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
