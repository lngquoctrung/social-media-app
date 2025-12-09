const userService = require("../services/user.service");
const { Ok } = require("../core/success.response");

const getProfile = async (req, res) => {
	const { userId } = req.user;
	const user = await userService.getProfile(userId);
	new Ok({
		message: "Get profile successfully",
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
	uploadAvatarImage,
	updateProfile,
};
