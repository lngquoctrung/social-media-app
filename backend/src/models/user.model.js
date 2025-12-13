const mongoose = require("mongoose");

// * Define validations for User model
const userSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
		unique: true,
	},
	password: {
		type: String,
	},
	avatar: {
		type: String,
		default: "/public/default/avatar.jpg",
	},
	gender: {
		type: String,
		enum: ["male", "female", "other"],
		default: "other",
	},
	birthday: {
		type: Date,
	},
	role: {
		type: String,
		default: "user",
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
	collection: "Users",
	timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
