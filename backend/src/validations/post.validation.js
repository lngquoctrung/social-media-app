const { body } = require("express-validator");

const postValidation = {
    createPost: [
        body("content").notEmpty().withMessage("Content is required"),
    ]
}

module.exports = postValidation;
