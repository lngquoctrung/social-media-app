const postService = require('../services/post.service');
const { Ok } = require("../core/success.response");

const getAllPosts = async (req, res) => {
	const posts = await postService.getAllPosts();
	new Ok({
		message: "Get all posts successfully",
		metadata: posts,
	}).send(res);
};

const createPost = async (req, res) => {
	new Ok({
		message: "Create post successfully",
		metadata: req.files,
	}).send(res);
}

module.exports = {
	getAllPosts,
	createPost
};
