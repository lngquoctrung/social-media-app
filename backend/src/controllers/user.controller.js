const userService = require("../services/user.service");
const { Ok } = require("../core/success.response");

const getProfile = async (req, res) => {
	const { userId } = req.user;
	const user = await userService.getUserById(userId);
	new Ok({
		message: "Get profile successfully",
		metadata: user,
	}).send(res);
};

const getUserById = async (req, res) => {
	const { id } = req.params;
	const user = await userService.getUserById(id);
	new Ok({
		message: "Get user successfully",
		metadata: user,
	}).send(res);
};

const uploadAvatarImage = async (req, res) => {
	const { userId } = req.user;
	const user = await userService.uploadAvatarImage(userId, req.file);
	new Ok({
		message: "Upload avatar image successfully",
		metadata: user,
	}).send(res);
};

const updateProfile = async (req, res) => {
	const { userId } = req.user;
	const user = await userService.updateProfile(userId, req.body);
	new Ok({
		message: "Update profile successfully",
		metadata: user,
	}).send(res);
};

module.exports = {
	getProfile,
	getUserById,
	uploadAvatarImage,
	updateProfile,
};
