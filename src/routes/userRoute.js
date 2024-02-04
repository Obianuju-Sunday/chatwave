const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController')


router.post("/auth/users/register", userController.registerUser);




module.exports = router;

