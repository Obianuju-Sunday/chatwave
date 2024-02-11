const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController')


router.post("/auth/users/register", userController.registerUser);

router.post("/auth/users/login", userController.loginUser);

router.get("/users", userController.getAllUsers)


module.exports = router;

