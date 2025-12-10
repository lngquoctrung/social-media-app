const { NotFoundError } = require("../core/error.response");
const userModel = require("../models/user.model");
const path = require("path");
const config = require("../config");
const { moveFile } = require("../utils/file.util");

class UserService {
    getUserById = async (userId) => {
        const user = await userModel.findById(userId).select("-password -role -createdAt -updatedAt").lean();
        if (!user) throw new NotFoundError({ message: "User not found" });
        return user;
    }

    uploadAvatarImage = async (userId, file) => {
        const apiPrefix = `${config.app.API_PREFIX}/${config.app.API_VERSION}`;
        const avatarUrl = `${config.auth.STORAGE_URL}/${apiPrefix}/public/images/avatars/${file.filename}`;
        const user = await userModel.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true }).select("-password -role -createdAt -updatedAt").lean();
        if (!user) throw new NotFoundError({ message: "User not found" });

        // Move file from temp to public
        await moveFile(file.path, path.join(config.uploader.avatar.destination, file.filename));

        return user;
    }

    updateProfile = async (userId, data) => {
        const user = await userModel.findByIdAndUpdate(userId, data, { new: true }).select("-password -role -createdAt -updatedAt").lean();
        if (!user) throw new NotFoundError({ message: "User not found" });
        return user;
    }
}

module.exports = new UserService();