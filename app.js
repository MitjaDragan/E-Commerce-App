const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swaggerJSDoc = require('swagger-jsdoc');
var routes = require('./routes/index');

// swagger definition
var swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0',
    description: 'Demonstrating how to describe a RESTful API with Swagger',
  },
  host: 'localhost:3000',
  basePath: '/',
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

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

// Middleware to parse JSON data
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

// serve swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
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
    console.log(name, email, hashedPassword, address);
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



app.post('/checkout/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    // Start a transaction
    await client.query('BEGIN');

    // Step 1: Retrieve cart items
    const cartQuery = 'SELECT * FROM cart WHERE user_id = $1';
    const cartResult = await client.query(cartQuery, [user_id]);

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).send('Cart is empty');
    }

    // Step 2: Calculate total price (assuming each cart item has a 'price' field)
    const totalPrice = cartResult.rows.reduce((acc, item) => acc + item.price, 0);

    // Step 3: Create an order (simplified for this example)
    const orderQuery = 'INSERT INTO orders (user_id, total_price, order_date, status) VALUES ($1, $2, NOW(), $3) RETURNING *';
    const orderResult = await client.query(orderQuery, [user_id, totalPrice, 'Processed']);

    // Step 4: Clear the user's cart
    const clearCartQuery = 'DELETE FROM cart WHERE user_id = $1';
    await client.query(clearCartQuery, [user_id]);

    // Commit the transaction
    await client.query('COMMIT');

    res.status(201).json(orderResult.rows[0]);
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query('ROLLBACK');
    console.error('Error during checkout:', error);
    res.status(500).send('Error during checkout');
  }
});


// Start the server
app.listen(port, () => {
  console.log(`E-Commerce API listening on port ${port}`);
});
