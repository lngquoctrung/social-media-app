const jwt = require('jsonwebtoken');
const { AuthFailureError } = require('../core/error.response');
const { verifyToken } = require('../utils/jwt.util');

const authMiddleware = async (req, res, next) => {
	try {
		// Check authorization header
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new AuthFailureError({ message: "Invalid Authentication Header" });
		}
		// Get token
		const token = authHeader.split(" ")[1];
		if (!token) throw new AuthFailureError({ message: "Token missing " });

		// Verify token
		const decodeToken = verifyToken(token);

		// Get user
		req.user = decodeToken;
		next();
	} catch (err) {
		next(err);
	}
}

module.exports = authMiddleware;