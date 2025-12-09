const postModel = require('../models/post.model');
const path = require("path");
const config = require("../config");
const { moveFile, removeFile } = require("../utils/file.util");

const { NotFoundError, ForbiddenError } = require("../core/error.response");

class PostService {
    getAllPosts = async () => {
        const posts = await postModel.find().lean();
        return posts;
    }

    createPost = async (userId, data) => {
        const apiPrefix = `${config.app.API_PREFIX}/${config.app.API_VERSION}`;
        const imageUrls = [];

        if (data?.images && data.images.length > 0) {
            data.images.forEach(image => {
                // Construct URL
                const imageUrl = `${config.auth.STORAGE_URL}/${apiPrefix}/public/images/posts/${image.filename}`;
                imageUrls.push(imageUrl);

                // Move file
                moveFile(
                    path.join(config.uploader.tempFolders.post, image.filename),
                    path.join(config.uploader.post.destination, image.filename)
                );
            });
        }

        const post = await postModel.create({
            content: data.content,
            user: userId,
            images: imageUrls
        });
        return post;
    }

    updatePost = async (userId, postId, data) => {
        const post = await postModel.findById(postId);
        if (!post) throw new NotFoundError({ message: "Post not found" });
        if (post.user.toString() !== userId) throw new ForbiddenError({ message: "You are not authorized to update this post" });

        const apiPrefix = `${config.app.API_PREFIX}/${config.app.API_VERSION}`;
        const newImages = data.images || []; // Contains URLs (kept) and Filenames (new)
        const currentImages = post.images || [];

        // 1. Identify images to delete (in current but not in new)
        const imagesToDelete = currentImages.filter(img => !newImages.includes(img));
        imagesToDelete.forEach(imgUrl => {
            // Extract filename from URL
            const filename = path.basename(imgUrl);
            removeFile(path.join(config.uploader.post.destination, filename));
        });

        // 2. Process new images
        const finalImageUrls = [];
        newImages.forEach(img => {
            if (img.startsWith("http")) {
                // Existing URL, keep it
                finalImageUrls.push(img);
            } else {
                // New Filename, move it
                const imageUrl = `${config.auth.STORAGE_URL}/${apiPrefix}/public/images/posts/${img}`;
                finalImageUrls.push(imageUrl);
                moveFile(
                    path.join(config.uploader.tempFolders.post, img),
                    path.join(config.uploader.post.destination, img)
                );
            }
        });

        const updatedPost = await postModel.findByIdAndUpdate(postId, { ...data, images: finalImageUrls }, { new: true });
        return updatedPost;
    }

    deletePost = async (userId, postId) => {
        const post = await postModel.findById(postId);
        if (!post) throw new NotFoundError({ message: "Post not found" });
        if (post.user.toString() !== userId) throw new ForbiddenError({ message: "You are not authorized to delete this post" });

        // Delete all images
        if (post.images && post.images.length > 0) {
            post.images.forEach(imgUrl => {
                const filename = path.basename(imgUrl);
                removeFile(path.join(config.uploader.post.destination, filename));
            });
        }

        await postModel.findByIdAndDelete(postId);
        return true;
    }
}

module.exports = new PostService();