const User = require('../Models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// register user controller
const register = async (req, res) => {
    try {
        // check if user already exists in database
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(400).send({
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

        // send success response with 201 created status
        res.status(201).send({
            success: true,
            message: 'User created successfully',
        });
    } catch (err) {
        // send error response with 500 server error status
        res.status(500).send({
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
            return res.status(404).send({
                success: false,
                message: 'User does not exist',
            });
        }

        // check if entered password matches database hash
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).send({
                success: false,
                message: 'Invalid password',
            });
        }

        // generate jwt token containing user id signed with secret key
        const token = jwt.sign(
            { userId: user._id },
            process.env.jwt_secret,
            { expiresIn: '1d' }
        );

        // send success response with token and user name
        return res.status(200).send({
            success: true,
            message: `User ${user.name} login successful`,
            accessToken: token,
            userName: user.name
        });

    } catch (err) {
        // send error response with 500 server error status
        res.status(500).send({
            success: false,
            message: err.message,
        });
    }
};

module.exports = {
    register,
    login,
};
