const postService = require('../services/post.service');
const { Ok, Created } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");

const getAllPosts = async (req, res) => {
	const posts = await postService.getAllPosts();
	new Ok({
		message: "Get all posts successfully",
		metadata: posts,
	}).send(res);
};

const uploadPostImages = async (req, res) => {
	if (!req.files || req.files.length === 0) {
		throw new BadRequestError({ message: "No files uploaded" });
	}
	new Created({
		message: "Upload post images successfully",
		metadata: req.files,
	}).send(res);
}

const createPost = async (req, res) => {
	const { userId } = req.user;

	const post = await postService.createPost(userId, req.body);
	new Created({
		message: "Create post successfully",
		metadata: post,
	}).send(res);
}

const updatePost = async (req, res) => {
	const { userId } = req.user;
	const { id } = req.params;
	const post = await postService.updatePost(userId, id, req.body);
	new Ok({
		message: "Update post successfully",
		metadata: post,
	}).send(res);
}

const deletePost = async (req, res) => {
	const { userId } = req.user;
	const { id } = req.params;
	await postService.deletePost(userId, id);
	new Ok({
		message: "Delete post successfully",
	}).send(res);
}

module.exports = {
	getAllPosts,
	uploadPostImages,
	createPost,
	updatePost,
	deletePost
};
