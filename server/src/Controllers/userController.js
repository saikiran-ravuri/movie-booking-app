const User = require('../Models/userModel');
const bcrypt = require('bcryptjs');

// register user controller
const register = async (req, res) => {
    try {
        // check if user already exists in database
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.send({
                success: false,
                message: 'User already exists',
            });
        }

        // generate salt and hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        // create and save new user in database
        const newUser = new User(req.body);
        await newUser.save();

        // send success response
        res.send({
            success: true,
            message: 'User created successfully',
        });
    } catch (err) {
        // send error response if something fails
        res.send({
            success: false,
            message: err.message,
        });
    }
};

// login user controller
const login = async (req, res) => {
    try {
        // find user by email in database
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.send({
                success: false,
                message: 'User does not exist',
            });
        }

        // check if entered password matches database hash
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.send({
                success: false,
                message: 'Invalid password',
            });
        }

        // send success response
        res.send({
            success: true,
            message: 'User logged in successfully',
            data: user.name
        });
    } catch (err) {
        // send error response if something fails
        res.send({
            success: false,
            message: err.message,
        });
    }
};

module.exports = {
    register,
    login,
};
