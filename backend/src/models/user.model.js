const mongoose = require('mongoose');

// * Define validations for User model
const userSchema = new mongoose.Schema({
	fullName: {
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
			'http://localhost:5050/api/v1/public/images/avatars/default-avatar.jpg',
	},
	role: {
		type: String,
		default: 'user',
	},
	refreshToken: {
		type: String,
		default: '',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('User', userSchema);
