const express = require("express");
const commentController = require("../../controllers/comment.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const asyncHandler = require("../../core/async.handler");

const router = express.Router();

router.post("/", authMiddleware, asyncHandler(commentController.createComment));
router.get("/:postId", authMiddleware.optional, asyncHandler(commentController.getCommentsByPost));
router.delete("/:id", authMiddleware, asyncHandler(commentController.deleteComment));
router.put("/:id", authMiddleware, asyncHandler(commentController.updateComment));

module.exports = router;
