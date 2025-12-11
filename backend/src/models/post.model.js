const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	content: {
		type: String,
	},
	images: {
		type: Array,
		default: [],
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
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
	collection: "Posts",
	timestamps: true,
});

module.exports = mongoose.model("Post", postSchema);
