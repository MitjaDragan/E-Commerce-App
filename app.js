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

// Add a new product
app.post('/products', async (req, res) => {
  try {
    const { name, description, price, stock_quantity } = req.body;

    // Basic validation
    if (!name || !description || price == null || stock_quantity == null) {
      return res.status(400).send('All fields are required');
    }

    const query = 'INSERT INTO products (name, description, price, stock_quantity) VALUES ($1, $2, $3, $4) RETURNING *';
    const newProduct = await client.query(query, [name, description, price, stock_quantity]);

    res.status(201).json(newProduct.rows[0]);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Error adding product');
  }
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).send('Error getting products');
  }
});

// Get a single product by id
app.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await client.query('SELECT * FROM products WHERE product_id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('Product not found');
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).send('Error getting product');
  }
});

// Update a product
app.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock_quantity } = req.body;
    // Basic validation
    if (!name && !description && price == null && stock_quantity == null) {
      return res.status(400).send('At least one field is required for update');
    }

    // Constructing dynamic query
    const fields = [];
    const values = [];
    if (name) {
      fields.push('name');
      values.push(name);
    }
    if (description) {
      fields.push('description');
      values.push(description);
    }
    if (price != null) {
      fields.push('price');
      values.push(price);
    }
    if (stock_quantity != null) {
      fields.push('stock_quantity');
      values.push(stock_quantity);
    }

    const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `UPDATE products SET ${setString} WHERE product_id = $${fields.length + 1} RETURNING *`;

    const updatedProduct = await client.query(query, [...values, id]);

    if (updatedProduct.rows.length === 0) {
      return res.status(404).send('Product not found');
    }

    res.json(updatedProduct.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Error updating product');
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await client.query('DELETE FROM products WHERE product_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('Product not found');
    }

    res.send('Product deleted successfully');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Error deleting product');
  }
});

app.get('/users', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM customers'); // Modify 'customers' if your table has a different name
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).send('Error getting users');
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await client.query('SELECT * FROM customers WHERE customer_id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).send('Error getting user');
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, address } = req.body; // Include other fields as necessary

    // Basic validation
    if (!name && !email && !password && !address) {
      return res.status(400).send('At least one field is required');
    }

    // Constructing dynamic query
    const fields = [];
    const values = [];
    if (name) {
      fields.push('name');
      values.push(name);
    }
    if (email) {
      fields.push('email');
      values.push(email);
    }
    // Hash password if it's being updated
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      fields.push('password');
      values.push(hashedPassword);
    }
    if (address) {
      fields.push('address');
      values.push(address);
    }

    const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `UPDATE customers SET ${setString} WHERE customer_id = $${fields.length + 1} RETURNING *`;

    const updatedUser = await client.query(query, [...values, id]);

    if (updatedUser.rows.length === 0) {
      return res.status(404).send('User not found');
    }

    res.json(updatedUser.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Error updating user');
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await client.query('DELETE FROM customers WHERE customer_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }

    res.send('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Error deleting user');
  }
});

app.post('/cart', async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    // Basic validation
    if (!user_id || !product_id || !quantity) {
      return res.status(400).send('All fields are required');
    }

    const query = 'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';
    const newCartItem = await client.query(query, [user_id, product_id, quantity]);

    res.status(201).json(newCartItem.rows[0]);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).send('Error adding item to cart');
  }
});

app.get('/cart/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    const query = 'SELECT * FROM cart WHERE user_id = $1';
    const cartItems = await client.query(query, [user_id]);

    res.json(cartItems.rows);
  } catch (error) {
    console.error('Error getting cart items:', error);
    res.status(500).send('Error getting cart items');
  }
});

app.put('/cart/:cart_id', async (req, res) => {
  try {
    const { cart_id } = req.params;
    const { quantity } = req.body; // Assuming only quantity can be updated

    if (!quantity) {
      return res.status(400).send('Quantity is required');
    }

    const query = 'UPDATE cart SET quantity = $1 WHERE cart_id = $2 RETURNING *';
    const updatedCartItem = await client.query(query, [quantity, cart_id]);

    if (updatedCartItem.rows.length === 0) {
      return res.status(404).send('Cart item not found');
    }

    res.json(updatedCartItem.rows[0]);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).send('Error updating cart item');
  }
});

app.delete('/cart/:cart_id', async (req, res) => {
  try {
    const { cart_id } = req.params;

    const result = await client.query('DELETE FROM cart WHERE cart_id = $1 RETURNING *', [cart_id]);

    if (result.rows.length === 0) {
      return res.status(404).send('Cart item not found');
    }

    res.send('Cart item deleted successfully');
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).send('Error deleting cart item');
  }
});

app.post('/orders', async (req, res) => {
  try {
    const { user_id, total_price, order_date, status } = req.body;  // Add more fields as necessary

    // Basic validation
    if (!user_id || !total_price) {
      return res.status(400).send('Missing required fields');
    }

    const query = 'INSERT INTO orders (user_id, total_price, order_date, status) VALUES ($1, $2, $3, $4) RETURNING *';
    const newOrder = await client.query(query, [user_id, total_price, order_date || 'NOW()', status || 'Pending']);

    res.status(201).json(newOrder.rows[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send('Error creating order');
  }
});


app.get('/orders', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).send('Error getting orders');
  }
});

app.get('/orders/:order_id', async (req, res) => {
  try {
    const { order_id } = req.params;
    const result = await client.query('SELECT * FROM orders WHERE order_id = $1', [order_id]);

    if (result.rows.length === 0) {
      return res.status(404).send('Order not found');
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).send('Error getting order');
  }
});

app.put('/orders/:order_id', async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;  // Add more fields as necessary for updating

    if (!status) {
      return res.status(400).send('Status is required');
    }

    const query = 'UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *';
    const updatedOrder = await client.query(query, [status, order_id]);

    if (updatedOrder.rows.length === 0) {
      return res.status(404).send('Order not found');
    }

    res.json(updatedOrder.rows[0]);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).send('Error updating order');
  }
});

app.delete('/orders/:order_id', async (req, res) => {
  try {
    const { order_id } = req.params;

    const result = await client.query('DELETE FROM orders WHERE order_id = $1 RETURNING *', [order_id]);

    if (result.rows.length === 0) {
      return res.status(404).send('Order not found');
    }

    res.send('Order deleted successfully');
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).send('Error deleting order');
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
