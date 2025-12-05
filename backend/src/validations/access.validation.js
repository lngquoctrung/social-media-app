const { body } = require("express-validator");

const accessValidation = {
    signUp: [
        body("name")
            .notEmpty().withMessage("Full name is required"),
        body("email")
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Email is invalid"),
        body("password")
            .notEmpty().withMessage("Password is required")
            .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
            .isStrongPassword().withMessage("Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol")
    ],
    login: [
        body("email")
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Email is invalid"),
        body("password")
            .notEmpty().withMessage("Password is required")
    ]
}

module.exports = accessValidation;