const { ForbiddenError } = require("../core/error.response");

const roleMiddleware = (allowedRoles = []) => {
    return async (req, res, next) => {
        if (!req.user || !req.user.role) {
            return next(new ForbiddenError({ message: "User role not defined " }));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new ForbiddenError({ message: "Access denied: You do not have permission" }));
        }
        next();
    }
}

module.exports = roleMiddleware;