var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://postgres:Delta%232023!@localhost:5432/ecommerce';
var db = pgp(connectionString);

//Products
function getAllProducts(req, res, next) {
  db.any('select * from products')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL products'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleProduct(req, res, next) {
  var prodID = parseInt(req.params.id);
  db.one('select * from products where product_id = $1', prodID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE product'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createProduct(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into products(name, description, price, stock_quantity)' +
      'values(${name}, ${description}, ${price}, ${stock_quantity})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one product'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateProduct(req, res, next) {
  db.none('update products set name=$1, description=$2, price=$3, stock_quantity=$4 where product_id=$5',
    [req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated product'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeProduct(req, res, next) {
  var prodID = parseInt(req.params.id);
  db.result('delete from products where product_id = $1', prodID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} product`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}



//Customers
function getAllCustomers(req, res, next) {
  db.any('select * from customers')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL customers'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleCustomer(req, res, next) {
  var custID = parseInt(req.params.id);
  db.one('select * from customers where customer_id = $1', custID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE customer'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createCustomer(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into customers(name, email, password, address)' +
      'values(${name}, ${email}, ${password}, ${address})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one customer'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateCustomer(req, res, next) {
  db.none('update customers set name=$1, email=$2, password=$3, address=$4 where customer_id=$5',
    [req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated customer'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeCustomer(req, res, next) {
  var custID = parseInt(req.params.id);
  db.result('delete from customers where customer_id = $1', custID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} customer`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}




//Order
function getAllOrders(req, res, next) {
  db.any('select * from orders')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL orders'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleOrder(req, res, next) {
  var ordID = parseInt(req.params.id);
  db.one('select * from orders where order_id = $1', ordID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE order'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createOrder(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into orders(customer_id, order_date, status)' +
      'values(${customer_id}, ${order_date}, ${status})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one order'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateOrder(req, res, next) {
  db.none('update orders set customer_id=$1, order_date=$2, status=$3 where order_id=$5',
    [req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated order'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeOrder(req, res, next) {
  var ordID = parseInt(req.params.id);
  db.result('delete from orders where order_id = $1', ordID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} order`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}



module.exports = {
  getAllProducts: getAllProducts,
  getSingleProduct: getSingleProduct,
  createProduct: createProduct,
  updateProduct: updateProduct,
  removeProduct: removeProduct,
  getAllCustomers: getAllCustomers,
  getSingleCustomer: getSingleCustomer,
  createCustomer: createCustomer,
  updateCustomer: updateCustomer,
  removeCustomer: removeCustomer,
  getAllOrders: getAllOrders,
  getSingleOrder: getSingleOrder,
  createOrder: createOrder,
  updateOrder: updateOrder,
  removeOrder: removeOrder
};