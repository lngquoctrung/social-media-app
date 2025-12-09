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
	const comments = await commentService.getCommentsByPost(postId);
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

module.exports = {
	createComment,
	getCommentsByPost,
	deleteComment
};
