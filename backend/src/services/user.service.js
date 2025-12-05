const userModel = require("../models/user.model");

class UserService {
    getProfile = async (userId) => {
        return await userModel.findById(userId);
    }
}

module.exports = new UserService();