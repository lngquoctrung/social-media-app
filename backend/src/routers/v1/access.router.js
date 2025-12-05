const express = require("express");
const { login, signUp } = require("../../validations/access.validation");
const validate = require("../../middlewares/validator.middleware");
const asyncHandler = require("../../core/async.handler");
const accessController = require("../../controllers/access.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const router = express.Router();

router.post("/register",
    signUp,
    validate,
    asyncHandler(accessController.signUp)
);
router.post("/login",
    login,
    validate,
    asyncHandler(accessController.login)
);
router.post("/logout",
    authMiddleware,
    asyncHandler(accessController.logout)
);
router.post("/refresh",
    asyncHandler(accessController.refreshToken)
);

module.exports = router;
