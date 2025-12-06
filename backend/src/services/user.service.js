const { NotFoundError, BadRequestError } = require("../core/error.response");
const userModel = require("../models/user.model");

class UserService {
    getProfile = async (userId) => {
        const user = await userModel.findById(userId).select("-password -role -createdAt -updatedAt").lean();
        if (!user) throw new NotFoundError({ message: "User not found" });
        return user;
    }

    updateProfile = async (userId, data) => {
        // Check if the old data and new data have changed?
        const oldUserData = await userModel.findById(userId).select("-password -role -createdAt -updatedAt").lean();
        if (!oldUserData) throw new NotFoundError({ message: "User not found" });

        const isChange = Object.keys(data).some(key => data[key] !== oldUserData[key]);
        if (!isChange) throw new BadRequestError({ message: "No data to update" });

        // Update user
        const newUser = await userModel.findByIdAndUpdate(userId, {
            ...data,
            updatedAt: Date.now(),
        }, {
            new: true
        }).select("-password -role -createdAt -updatedAt").lean();
        if (!newUser) throw new NotFoundError({ message: "User not found" });
        return newUser;
    }
}

module.exports = new UserService();