var express = require('express');
var router = express.Router();

var db = require('../queries');

/**
 * @swagger
 * definitions:
 *   Product:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       price:
 *         type: integer
 *       stock_quantity:
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
 *           $ref: '#/definitions/Product'
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
 *           $ref: '#/definitions/Products'
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
 *           $ref: '#/definitions/Product'
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.post('/products', db.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags: Products
 *     description: Updates a single product
 *     produces: application/json
 *     parameters:
 *       name: product
 *       in: body
 *       description: Fields for the Product resource
 *       schema:
 *         type: array
 *         $ref: '#/definitions/Product'
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



router.get('/customers', db.getAllCustomers);
  
router.get('/customers/:id', db.getSingleCustomer);

router.put('/customers/:id', db.updateCustomer);

router.delete('/customers/:id', db.removeCustomer);



router.get('/orders', db.getAllOrders);
  
router.get('/orders/:order_id', db.getSingleOrder);

router.post('/orders', db.createOrder);

router.put('/orders/:order_id', db.updateOrder);

router.delete('/orders/:order_id', db.removeOrder);




module.exports = router;