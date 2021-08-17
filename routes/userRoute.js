const express = require('express');
const router = express.Router();

var userController = require("../controllers/userController");

// allow user to register
router.post('/register',userController.userRegister);

router.post('/update',userController.updateUser);

router.post('/login',userController.UserLoginPost);
router.post('/',userController.checkUser);
// export the routes
module.exports = router;