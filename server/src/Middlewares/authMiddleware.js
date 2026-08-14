const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

// verify jwt authentication token middleware
const verifyToken = (req, res, next) => {
    // fetch token from header (supports x-access-token and authorization header)
    const token = req.headers['x-access-token'] || (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.headers.authorization;

    if (!token) {
        return res.status(400).send({ success: false, message: "JWT token is not passed" });
    }

    // token is present, verify using secret key
    const secretKey = process.env.jwt_secret || process.env.SECRET_KEY;
    jwt.verify(token, secretKey, async (err, payload) => {
        if (err) {
            return res.status(403).send({ success: false, message: "You are not authenticated to access this route" });
        }

        const userId = payload.userId;

        try {
            const userDetails = await User.findById(userId);
            req.userDetails = userDetails;
            req.body.userId = userId;
            next();
        } catch (err) {
            return res.status(500).send({ message: "Internal Server Error" });
        }
    });
};

// verify admin authorization middleware
const verifyAdmin = (req, res, next) => {
    // safely assume person is authenticated
    const role = req.userDetails && req.userDetails.role;
    const userName = req.userDetails ? (req.userDetails.name || req.userDetails._id) : '';

    if (role !== 'admin') {
        return res.status(403).send({
            success: false,
            message: `User ${userName} is not authorised to access this route`
        });
    }

    next();
};

module.exports = { verifyToken, verifyAdmin };
