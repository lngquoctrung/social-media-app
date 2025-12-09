const postModel = require('../models/post.model');
const path = require("path");
const config = require("../config");
const { moveFile } = require("../utils/file.util");

class PostService {
    getAllPosts = async () => {
        const posts = await postModel.find();
        return posts;
    }

    createPost = async (userId, data) => {
        const post = await postModel.create({ ...data, user: userId });

        if (data.images && data.images.length > 0) {
            data.images.forEach(image => {
                moveFile(
                    path.join(config.uploader.tempFolders.post, image),
                    path.join(config.uploader.post.destination, image)
                );
            });
        }

        return post;
    }
}

module.exports = new PostService();