const mongoose = require("mongoose");
const config = require("../config");

const protocol = config.env.NODE_ENV === "development" ? "http" : "https";
const apiPrefix = `${config.app.API_PREFIX}/${config.app.API_VERSION}`;

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
		default:
			`${protocol}://${config.env.HOST}:${config.env.PORT}/${apiPrefix}/public/images/avatars/default-avatar.jpg`,
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
