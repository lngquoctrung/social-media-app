const { NotFoundError } = require("../core/error.response");
const userModel = require("../models/user.model");

class UserService {
    getProfile = async (userId) => {
        const user = await userModel.findById(userId).select("-password -role -createdAt -updatedAt").lean();
        if (!user) throw new NotFoundError({ message: "User not found" });
        return user;
    }

    updateProfile = async (userId, data) => {
        const user = await userModel.findByIdAndUpdate(userId, data, { new: true }).select("-password -role -createdAt -updatedAt").lean();
        if (!user) throw new NotFoundError({ message: "User not found" });
        return user;
    }
}

module.exports = new UserService();