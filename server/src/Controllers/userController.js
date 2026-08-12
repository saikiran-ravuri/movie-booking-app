const userModel = require('../models/userModel');

// Register New User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user already exists
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // 2. Create new user in DB
        const newUser = await userModel.create({
            name,
            email,
            password,
        });

        // 3. Send success response
        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            data: newUser,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    registerUser,
};
