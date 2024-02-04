const User = require('../model/user');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

    const registerUser = async (req, res) => {

        try {

            const newUser = await User.create({
                fullName: req.body.fullName,
                userName: req.body.userName,
                email: req.body.email,
                password: req.body.password,
                passwordConfirm: req.body.passwordConfirm
            });
    
            let user = await User.findOne({ email: req.body })
    
            if (user) return res.status(404).json('User with email already exist...')
    
            if (!fullName || !userName || !email || !password || !passwordConfirm) { 
                return res.status(400).json('All fields are required!') 
            }
    
            if (!validator.isEmail({email: req.body.email})) res.status(400).json('Email must be valid!!')
    
            if (!validator.isStrongPassword(password)) res.status(400).json('Password must be a strong one!!') //one uppercase letter, lowercase letter, a number and a special character
    
            // await user.save();
    
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            })
    
    
            res.status(201).json({
                status: 'success',
                token,
                data: {
                    user: newUser
                }
            });
        } catch (error) {
            // next(new AppError("Internal server error", 500))
            console.log(error);
            res.status(500).json(error)
        }
    };
    

module.exports = { registerUser }