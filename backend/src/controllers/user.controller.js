const userService = require("../services/user.service");
const { Ok } = require("../core/success.response");

const getAllUsers = async (req, res) => {
	new Ok({ message: "Get all users successfully" });
};

const getUserById = async (req, res) => {

};

module.exports = {
	getAllUsers,
	getUserById,
};
