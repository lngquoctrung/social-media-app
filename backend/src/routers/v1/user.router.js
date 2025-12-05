const express = require("express");
const userController = require("../../controllers/user.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");
const asyncHandler = require("../../core/async.handler");

const router = express.Router();

// router.get("/",
//     authMiddleware,
//     roleMiddleware(["admin"]),
//     asyncHandler(userController.getAllUsers)
// );
router.get("/me",
    authMiddleware,
    asyncHandler(userController.getProfile)
)
router.put("/me",
    authMiddleware,
    asyncHandler(userController.updateProfile)
)

module.exports = router;
