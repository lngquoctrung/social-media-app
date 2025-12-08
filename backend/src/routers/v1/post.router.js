const express = require("express");
const postController = require("../../controllers/post.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const uploaderMiddleware = require("../../middlewares/uploader.middleware");

const router = express.Router();

router.get("/", postController.getAllPosts);
router.post("/", authMiddleware, postController.createPost);
router.post("/upload-images", authMiddleware, uploaderMiddleware.uploadPostImages, postController.uploadPostImages);

module.exports = router;
