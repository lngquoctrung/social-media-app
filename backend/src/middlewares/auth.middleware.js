const jwt = require('jsonwebtoken');
const { AuthFailureError } = require('../core/error.response');
const { verifyToken } = require('../utils/jwt.util');
const tokenService = require('../services/token.service');

const processToken = async (req) => {
	const authHeader = req.headers.authorization;
	let token;
	if (authHeader && authHeader.startsWith("Bearer ")) {
		token = authHeader.split(" ")[1];
	} else if (req.cookies && req.cookies.accessToken) {
		token = req.cookies.accessToken;
	}

	if (!token) return null;

	const decodeToken = await verifyToken(token);
	const storedKey = await tokenService.findByUserId(decodeToken.userId);

	if (!storedKey) return null;

	return { storedKey, user: decodeToken };
}

const authMiddleware = async (req, res, next) => {
	try {
		const result = await processToken(req);
		if (!result) throw new AuthFailureError({ message: "Invalid Authentication" });

		req.storedKey = result.storedKey;
		req.user = result.user;

		next();
	} catch (err) {
		next(err);
	}
}

const optionalAuthMiddleware = async (req, res, next) => {
	try {
		const result = await processToken(req);
		if (result) {
			req.storedKey = result.storedKey;
			req.user = result.user;
		}
		next();
	} catch (err) {
		next();
	}
}

authMiddleware.optional = optionalAuthMiddleware;

module.exports = authMiddleware;