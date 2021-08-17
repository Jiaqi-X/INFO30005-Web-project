const express = require('express');
const router = express.Router();

var snackController = require("../controllers/snackController");

// post register 
// router.post('/addSnack',snackController.addSnack);
// get the all the snacks in the menu
router.get('/menu',snackController.getSnackMenu);

// get one specific snack's info
router.get('/menu/:id',snackController.getSnackDetail);

// export the routes
module.exports = router;