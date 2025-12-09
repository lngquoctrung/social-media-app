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
            await Promise.all(data.images.map(async (filename) => {
                const tempPath = path.join(config.uploader.tempFolders.post, filename);
                const destPath = path.join(config.uploader.post.destination, filename);

                const imageUrl = `${config.auth.STORAGE_URL}/${apiPrefix}/public/images/posts/${filename}`;
                imageUrls.push(imageUrl);

                await moveFile(tempPath, destPath);
            }));
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
        if (post.user.toString() !== userId) throw new ForbiddenError({ message: "Unauthorized" });

        const apiPrefix = `${config.app.API_PREFIX}/${config.app.API_VERSION}`;
        const incomingImages = data.images || [];
        const currentDbImages = post.images || [];

        const imagesToDelete = currentDbImages.filter(dbImg => !incomingImages.includes(dbImg));

        if (imagesToDelete.length > 0) {
            imagesToDelete.forEach(imgUrl => {
                const filename = path.basename(imgUrl);
                removeFile(path.join(config.uploader.post.destination, filename)).catch(console.error);
            });
        }

        const finalImageUrls = [];

        for (const item of incomingImages) {
            if (item.startsWith("http")) {
                finalImageUrls.push(item);
            } else {
                const filename = item;
                const tempPath = path.join(config.uploader.tempFolders.post, filename);
                const destPath = path.join(config.uploader.post.destination, filename);

                await moveFile(tempPath, destPath);

                const newUrl = `${config.auth.STORAGE_URL}/${apiPrefix}/public/images/posts/${filename}`;
                finalImageUrls.push(newUrl);
            }
        }

        const updatedPost = await postModel.findByIdAndUpdate(
            postId,
            { ...data, images: finalImageUrls },
            { new: true }
        );
        return updatedPost;
    }

    deletePost = async (userId, postId) => {
        const post = await postModel.findById(postId);
        if (!post) throw new NotFoundError({ message: "Post not found" });
        if (post.user.toString() !== userId) throw new ForbiddenError({ message: "Unauthorized" });

        // Delete all images
        if (post.images && post.images.length > 0) {
            for (const imgUrl of post.images) {
                const filename = path.basename(imgUrl);
                await removeFile(path.join(config.uploader.post.destination, filename));
            }
        }

        await postModel.findByIdAndDelete(postId);
        return true;
    }
}

module.exports = new PostService();