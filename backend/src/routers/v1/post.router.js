const express = require('express');
const postController = require('../../controllers/postController');
const uploader = require('../../middlewares/uploader.middleware');
const verifyToken = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.post('/create', verifyToken, uploader, postController.createPost);

module.exports = router;
