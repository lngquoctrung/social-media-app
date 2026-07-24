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
	const currentUserId = req.user?.userId;
	const user = await userService.getUserById(id, currentUserId);
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

const toggleFollow = async (req, res) => {
	const { userId: currentUserId } = req.user;
	const { id: targetUserId } = req.params;
	const result = await userService.toggleFollow(currentUserId, targetUserId);
	new Ok({
		message: result.followed ? "Followed successfully" : "Unfollowed successfully",
		metadata: result,
	}).send(res);
};

const getFollowers = async (req, res) => {
	const { id } = req.params;
	const followers = await userService.getFollowers(id);
	new Ok({
		message: "Get followers successfully",
		metadata: followers,
	}).send(res);
};

const getFollowing = async (req, res) => {
	const { id } = req.params;
	const following = await userService.getFollowing(id);
	new Ok({
		message: "Get following successfully",
		metadata: following,
	}).send(res);
};

module.exports = {
	getProfile,
	getUserById,
	uploadAvatarImage,
	updateProfile,
    toggleFollow,
    getFollowers,
    getFollowing
};
