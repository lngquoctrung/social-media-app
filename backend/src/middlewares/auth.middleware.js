const jwt = require('jsonwebtoken');
const { AuthFailureError } = require('../core/error.response');
const { verifyToken } = require('../utils/jwt.util');
const tokenService = require('../services/token.service');

const authMiddleware = async (req, res, next) => {
	try {
		// Check authorization header
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new AuthFailureError({ message: "Invalid Authentication Header" });
		}
		// Get token
		const token = authHeader.split(" ")[1];
		if (!token) throw new AuthFailureError({ message: "Token missing" });

		// Verify token
		const decodeToken = await verifyToken(token);

		// Get token id
		const storedKey = await tokenService.findByUserId(decodeToken.userId);
		if (!storedKey) throw new AuthFailureError({ message: "Token not found" });

		// Assign user and token id for next middleware
		req.storedKey = storedKey;
		req.user = decodeToken;

		next();
	} catch (err) {
		next(err);
	}
}

module.exports = authMiddleware;