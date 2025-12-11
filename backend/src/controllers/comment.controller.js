const commentService = require('../services/comment.service');
const { Ok, Created } = require("../core/success.response");

const createComment = async (req, res) => {
	const { userId } = req.user;
	const comment = await commentService.createComment(userId, req.body);
	new Created({
		message: "Create comment successfully",
		metadata: comment,
	}).send(res);
}

const getCommentsByPost = async (req, res) => {
	const { postId } = req.params;
	const userId = req.user?.userId;
	const comments = await commentService.getCommentsByPost(postId, userId);
	new Ok({
		message: "Get comments successfully",
		metadata: comments,
	}).send(res);
}

const deleteComment = async (req, res) => {
	const { userId } = req.user;
	const { id } = req.params;
	await commentService.deleteComment(userId, id);
	new Ok({
		message: "Delete comment successfully",
	}).send(res);
}

const updateComment = async (req, res) => {
	const { userId } = req.user;
	const { id } = req.params;
	const { content } = req.body;
	const comment = await commentService.updateComment(userId, id, content);
	new Ok({
		message: "Update comment successfully",
		metadata: comment,
	}).send(res);
}

module.exports = {
	createComment,
	getCommentsByPost,
	deleteComment,
	updateComment
};
