const User = require('../model/userSchema');
// const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { email, password, fullName, userName, passwordConfirm } = req.body;

        // Validate email and username uniqueness
        const existingUser = await User.findOne({
            $or: [{ email }, { userName }],
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or username already exists.' });
        }

        // Create and save new user
        const user = new User({ email, userName, fullName, password, passwordConfirm });
        await user.save();

        // Send success response
        res.status(201).json({
            status: 'success',
            data: {
                user: user
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


const getAllUsers = async (req, res, next) => {
    const users = await User.find();

    if (users.length === 0) {
        return res.status(200).json({
            status: 'Success!',
            message: 'No users found in the database',
            data: {
                users: []
            }
        });
    }

    try {
        res.status(200).json({
            status: 'Success!',
            results: users.length,
            data: {
                users
            }
        })
    } catch (error) {
        next(new AppError("Internal server error", 500))
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Compare password hashes
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT token for user authentication
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        // Send success response with token
        res.status(200).json({
            status: 'Success!',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


module.exports = { registerUser, loginUser, getAllUsers }