const jwt = require('jsonwebtoken');
const User = require('../models/user')

const authMiddleware = () => {
    return async (req, res, next) => {
        const token = req.header('Authorization');
        console.log(token);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized HTTP, Token not provided" });
        }

        const jwtToken = token.replace(/^Bearer\s/, "").trim();
        console.log("Token from middleware ", jwtToken);

        try {
            const isVerified = jwt.verify(jwtToken, "bookstore123");
            console.log("Decoded Token: ", isVerified);

            const userData = await User.findOne({ _id: isVerified._id }).select({ password: 0 });

            if (!userData) {
                console.log("User not found");
                return res.status(401).json({ message: "User not found" });
            } 
            req.user = userData;
            req.token = token;
            req.userID = userData._id;

            next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    };
};

module.exports = authMiddleware;