const express = require('express');
const router = express.Router();

var vendorController = require('../controllers/vendorController')

router.get("/",vendorController.vendorGetFive)
router.post("/login",vendorController.VendorLoginPost);
router.post("/loginState",vendorController.checkVendor);

// register a new van
router.post('/register',vendorController.vendorRegister);

// update the information of a vendor
router.post('/park/:id',vendorController.vendorParkPost);

// export the routes
module.exports = router;