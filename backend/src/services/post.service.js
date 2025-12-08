const postModel = require('../models/post.model');

class PostService {
    getAllPosts = async () => {
        const posts = await postModel.find();
        return posts;
    }

    createPost = async (post) => {

    }
}

module.exports = new PostService();