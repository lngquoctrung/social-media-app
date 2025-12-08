const express = require('express');
const postController = require("../../controllers/post.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const uploaderMiddleware = require("../../middlewares/uploader.middleware");

const router = express.Router();

router.get('/', postController.getAllPosts);
router.post('/', authMiddleware, uploaderMiddleware.uploadPostImages, postController.createPost);

module.exports = router;
