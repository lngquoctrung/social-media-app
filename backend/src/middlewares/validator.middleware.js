const { validationResult } = require("express-validator");
const { BadRequestError } = require("../core/error.response");

const validate = (req, res, next) => {
    // Get validation result from request
    const errors = validationResult(req);

    // If there are no errors, continue to the next middleware
    if (errors.isEmpty()) return next();

    // If there are errors, get the first error
    const firstError = errors.array()[0];

    // Throw error for response middleware
    throw new BadRequestError({ message: firstError.msg });
}

module.exports = validate;
