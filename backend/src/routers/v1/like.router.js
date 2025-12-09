const express = require("express");
const likeController = require("../../controllers/like.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const asyncHandler = require("../../core/async.handler");

const router = express.Router();

router.post("/toggle", authMiddleware, asyncHandler(likeController.toggleLike));
router.get("/:targetId", asyncHandler(likeController.getLikes));

module.exports = router;
