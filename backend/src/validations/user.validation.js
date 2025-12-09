const { body } = require("express-validator");

const userValidation = {
    updateProfile: [
        body("name")
            .notEmpty().withMessage("Name is required"),
        body("birthday")
            .isISO8601().withMessage("Birthday is invalid")
            .notEmpty().withMessage("Birthday is required")
            .toDate(),
        body("gender")
            .isIn(["male", "female", "other"]).withMessage("Gender is invalid")
            .notEmpty().withMessage("Gender is required")
    ],
}

module.exports = userValidation;