const express = require("express");
const postController = require("../../controllers/post.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const uploaderMiddleware = require("../../middlewares/uploader.middleware");
const asyncHandler = require("../../core/async.handler");

const router = express.Router();

router.get("/",
    asyncHandler(postController.getAllPosts)
);
router.post("/",
    authMiddleware,
    asyncHandler(postController.createPost)
);
router.post("/upload-images",
    authMiddleware,
    uploaderMiddleware.uploadPostImages,
    asyncHandler(postController.uploadPostImages)
);
router.put("/:id",
    authMiddleware,
    asyncHandler(postController.updatePost)
);
router.delete("/:id",
    authMiddleware,
    asyncHandler(postController.deletePost)
);

module.exports = router;
