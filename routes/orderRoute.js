const express = require('express');
const router = express.Router();

var orderController = require("../controllers/orderController");

// create a new order
router.post('/create', orderController.createNewOrderPost);

// get the orders under a vendor
router.get('/',orderController.getAllOrder);

// update the status or details of a order
router.post('/update/:orderID',orderController.updateOrderPost);

// export the routes
module.exports = router;