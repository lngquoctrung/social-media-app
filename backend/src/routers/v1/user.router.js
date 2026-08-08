const express = require("express");
const userController = require("../../controllers/user.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");
const asyncHandler = require("../../core/async.handler");
const userValidation = require("../../validations/user.validation");
const uploaderMiddleware = require("../../middlewares/uploader.middleware");

const router = express.Router();

router.get("/me",
    authMiddleware,
    asyncHandler(userController.getProfile)
);
router.put("/me",
    authMiddleware,
    userValidation.updateProfile,
    asyncHandler(userController.updateProfile)
);
router.put("/me/avatar",
    authMiddleware,
    uploaderMiddleware.uploadAvatarImage,
    asyncHandler(userController.uploadAvatarImage)
);

router.post("/:id/follow",
    authMiddleware,
    asyncHandler(userController.toggleFollow)
);
router.get("/friends/mutual",
    authMiddleware,
    asyncHandler(userController.getMutualFriends)
);
router.get("/friends/recommendations",
    authMiddleware,
    asyncHandler(userController.getRecommendedFriends)
);
router.get("/:id/followers",
    asyncHandler(userController.getFollowers)
);
router.get("/:id/following",
    asyncHandler(userController.getFollowing)
);

router.get("/:id",
    authMiddleware.optional,
    asyncHandler(userController.getUserById)
);

module.exports = router;
