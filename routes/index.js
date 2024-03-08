var express = require('express');
var router = express.Router();

var db = require('../queries');

/**
 * @swagger
 * definitions:
 *   Product:
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       price:
 *         type: integer
 *       stock_quantity:
 *         type: integer
 *   Customer:
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *   Order:
 *     properties:
 *       customer_id:
 *         type: integer
 *       product_id:
 *         type: integer
 *       quantity:
 *         type: integer
 */ 

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     description: Returns all products
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of products
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/paths/definitions/Product'
 */
router.get('/products', db.getAllProducts);
  
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     description: Returns a single product
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Product's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single product
 *         schema:
 *           $ref: '#/paths/definitions/Product'
 */
router.get('/products/:id', db.getSingleProduct);

/**
 * @swagger
 * /products:
 *   post:
 *     tags:
 *       - Products
 *     description: Creates a new product
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: product
 *         description: Product object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/paths/definitions/Product'
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.post('/products', db.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags: 
 *       - Products
 *     description: Updates a single product
 *     produces: 
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the product to update
 *         required: true
 *         type: integer
 *       - name: product
 *         in: body
 *         description: Fields for the Product resource
 *         schema:
 *           $ref: '#/paths/definitions/Product'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
router.put('/products/:id', db.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     description: Deletes a single product
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Product's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
router.delete('/products/:id', db.removeProduct);

/**
 * @swagger
 * /customers:
 *   get:
 *     tags:
 *       - Customers
 *     description: Returns all customers
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of customers
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/paths/definitions/Customer'
 */
router.get('/customers', db.getAllCustomers);
  
/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     tags:
 *       - Customers
 *     description: Returns a single customer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Customer's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single customer
 *         schema:
 *           $ref: '#/paths/definitions/Customer'
 */
router.get('/customers/:id', db.getSingleCustomer);

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     tags: 
 *       - Customers
 *     description: Updates a single customer
 *     produces: 
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the customer to update
 *         required: true
 *         type: integer
 *       - name: customer
 *         in: body
 *         description: Fields for the Customer resource
 *         schema:
 *           $ref: '#/paths/definitions/Customer'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
router.put('/customers/:id', db.updateCustomer);

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     tags:
 *       - Customers
 *     description: Deletes a single customer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Customer's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
router.delete('/customers/:id', db.removeCustomer);

/**
 * @swagger
 * /orders:
 *   get:
 *     tags:
 *       - Orders
 *     description: Returns all orders
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of orders
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/paths/definitions/Order'
 */
router.get('/orders', db.getAllOrders);
  
/**
 * @swagger
 * /orders/{order_id}:
 *   get:
 *     tags:
 *       - Orders
 *     description: Returns a single order
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: order_id
 *         description: Order's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single order
 *         schema:
 *           $ref: '#/paths/definitions/Order'
 */
router.get('/orders/:order_id', db.getSingleOrder);

/**
 * @swagger
 * /orders:
 *   post:
 *     tags:
 *       - Orders
 *     description: Creates a new order
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: order
 *         description: Order object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/paths/definitions/Order'
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.post('/orders', db.createOrder);

/**
 * @swagger
 * /orders/{order_id}:
 *   put:
 *     tags: 
 *       - Orders
 *     description: Updates a single order
 *     produces: 
 *       - application/json
 *     parameters:
 *       - name: order_id
 *         in: path
 *         description: ID of the order to update
 *         required: true
 *         type: integer
 *       - name: order
 *         in: body
 *         description: Fields for the Order resource
 *         schema:
 *           $ref: '#/paths/definitions/Order'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
router.put('/orders/:order_id', db.updateOrder);

/**
 * @swagger
 * /orders/{order_id}:
 *   delete:
 *     tags:
 *       - Orders
 *     description: Deletes a single order
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: order_id
 *         description: Order's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
router.delete('/orders/:order_id', db.removeOrder);

module.exports = router;
