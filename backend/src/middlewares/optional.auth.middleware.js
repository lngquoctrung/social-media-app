const jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/jwt.util');
const tokenService = require('../services/token.service');

const optionalAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            if (token) {
                try {
                    const decodeToken = await verifyToken(token);
                    const storedKey = await tokenService.findByUserId(decodeToken.userId);

                    if (storedKey) {
                        req.storedKey = storedKey;
                        req.user = decodeToken;
                    }
                } catch (error) {
                    // Token invalid or expired, proceed as guest
                    console.log("Optional auth: Token invalid or expired", error.message);
                }
            }
        }
        next();
    } catch (err) {
        next();
    }
}

module.exports = optionalAuthMiddleware;
