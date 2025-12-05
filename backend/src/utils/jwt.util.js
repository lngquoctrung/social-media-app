const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const config = require("../config");
const { AuthFailureError } = require("../core/error.response");

const signToken = async (payload, expires) => {
    return await promisify(jwt.sign)(payload, config.auth.JWT_PRIVATE_SECRET, {
        algorithm: "RS256",
        expiresIn: expires
    });
}

const verifyToken = async (token) => {
    try {
        return await promisify(jwt.verify)(token, config.auth.JWT_PUBLIC_SECRET, {
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
