const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    // 1. Get the token from the request headers
    // Standard practice is to send it as "Authorization: Bearer <token>"
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Extract just the token part
    }

    // 2. If there is no token, block the request
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    try {
        // 3. Verify the token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Attach the decoded payload (which contains the userId) to the request object
        req.user = decoded;
        
        // 5. 'next()' tells Express: "Security check passed, move on to the controller"
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(401).json({ message: "Not authorized, token failed or expired" });
    }
};

module.exports = { protect };

