const jwt = require("jsonwebtoken");
const UserModel = require("../Models/userModel");

const verifyToken = (req, res, next) => {
    // fetch the token from header (x-access-token or Authorization Bearer)
    const token = req.headers['x-access-token'] || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        return res.status(400).send({ success: false, message: "JWT token is not passed" });
    }

    // verify token with secret key
    const secretKey = process.env.jwt_secret || process.env.SECRET_KEY;
    jwt.verify(token, secretKey, async (err, payload) => {
        if (err) {
            return res.status(403).send({ success: false, message: "You are not authenticated to access this route" });
        }

        const userId = payload.userId;

        try {
            const userDetails = await UserModel.findById(userId);
            if (!userDetails) {
                return res.status(404).send({ success: false, message: "User account no longer exists" });
            }
            req.userDetails = userDetails;
            req.body.userId = userId;
            next();
        } catch (err) {
            return res.status(500).send({ success: false, message: "Internal Server Error" });
        }
    });
};

const verifyAdmin = (req, res, next) => {
    if (!req.userDetails || req.userDetails.role !== 'admin') {
        const userId = req.userDetails ? req.userDetails._id : 'unknown';
        return res.status(403).send({ success: false, message: `User with id ${userId} is not authorised to access this route` });
    }
    next();
};

module.exports = { verifyToken, verifyAdmin };