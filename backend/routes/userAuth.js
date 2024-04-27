const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader.replace(/^Bearer\s/,"").trim();
    // console.log(authHeader)
    if (token == null) {
        return res.status(401).json({ message: "Authentication token required" });
    }
    
    jwt.verify(token, "bookStore123", (err, user) => {
        console.log(err);
        if (err) {
            return res.status(403).json({message: "Token Expired. Please Sign-in Again."});
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };
