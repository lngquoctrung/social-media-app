const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	content: {
		type: String,
		require: true,
	},
	postId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post",
		require: true,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		require: true,
	},
	parentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment",
		default: null,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
}, {
	collection: 'Comments',
	timestamps: true,
});

module.exports = mongoose.model('Comment', commentSchema);
