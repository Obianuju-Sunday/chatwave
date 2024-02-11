const User = require('../model/user');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
    try {
        const { fullName, userName, email, password, passwordConfirm } = req.body;

        // Check if all required fields are provided
        if (!fullName || !userName || !email || !password || !passwordConfirm) {
            return res.status(400).json('All fields are required!');
        }

        // Check if email is valid
        if (!validator.isEmail(email)) {
            return res.status(400).json('Email must be valid!!');
        }

        // Check if password is strong
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json('Password must be a strong one!! Must contain at least one uppercase letter, lowercase letter, a number and a special character');//one uppercase letter, lowercase letter, a number and a special character
        }

        // Check if passwords match
        if (password !== passwordConfirm) {
            return res.status(400).json('Passwords do not match!');
        }

        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json('User with email already exists...');
        }

        // Create a new user
        const newUser = await User.create({
            fullName,
            userName,
            email,
            password,
            passwordConfirm
        });

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        // Return success response
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error');
    }
};



module.exports = { registerUser }