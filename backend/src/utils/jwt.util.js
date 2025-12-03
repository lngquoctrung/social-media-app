const jwt = require("jsonwebtoken");
const config = require("../config");
const { AuthFailureError } = require("../core/error.response");

const signToken = (user, expires) => {
    const payload = {
        id: user._id,
        role: user.role,
    }

    return jwt.sign(payload, config.auth.JWT_PRIVATE_SECRET, {
        algorithm: "RS256",
        expiresIn: expires
    });
}

const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.auth.JWT_PUBLIC_SECRET, {
            algorithms: ["RS256"]
        });
    } catch (e) {
        throw new AuthFailureError({ message: "Invalid Token or Token Expired" });
    }
}

module.exports = {
    signToken,
    verifyToken
}
