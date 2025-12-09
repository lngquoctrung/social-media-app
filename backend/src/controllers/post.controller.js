const postService = require('../services/post.service');
const { Ok } = require("../core/success.response");

const getAllPosts = async (req, res) => {
	const posts = await postService.getAllPosts();
	new Ok({
		message: "Get all posts successfully",
		metadata: posts,
	}).send(res);
};

const uploadPostImages = async (req, res) => {
	new Ok({
		message: "Upload post images successfully",
		metadata: req.files,
	}).send(res);
}

const createPost = async (req, res) => {
	const { userId } = req.user;
	const post = await postService.createPost(userId, req.body);
	new Ok({
		message: "Create post successfully",
		metadata: post,
	}).send(res);
}

module.exports = {
	getAllPosts,
	uploadPostImages,
	createPost
};
