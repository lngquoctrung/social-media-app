const { NotFoundError } = require("../core/error.response");
const userModel = require("../models/user.model");
const followModel = require("../models/follow.model");
const path = require("path");
const config = require("../config");
const { moveFile } = require("../utils/file.util");

class UserService {
    getUserById = async (userId, currentUserId) => {
        const user = await userModel.findById(userId).select("-password -role -createdAt -updatedAt").lean();
        if (!user) throw new NotFoundError({ message: "User not found" });

        const followersCount = await followModel.countDocuments({ following: userId });
        const followingCount = await followModel.countDocuments({ follower: userId });
        let isFollowing = false;
        if (currentUserId) {
            isFollowing = await this.checkFollowStatus(currentUserId, userId);
        }

        return { ...user, followersCount, followingCount, isFollowing };
    }

    uploadAvatarImage = async (userId, file) => {
        const avatarUrl = `/public/images/avatars/${file.filename}`;

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

    toggleFollow = async (currentUserId, targetUserId) => {
        if (currentUserId === targetUserId) {
            throw new Error("You cannot follow yourself");
        }
        
        const existingFollow = await followModel.findOne({ follower: currentUserId, following: targetUserId });
        
        if (existingFollow) {
            // Unfollow
            await followModel.findByIdAndDelete(existingFollow._id);
            return { followed: false };
        } else {
            // Follow
            await followModel.create({ follower: currentUserId, following: targetUserId });
            return { followed: true };
        }
    }

    getFollowers = async (userId) => {
        const followers = await followModel.find({ following: userId })
            .populate('follower', 'name avatar email _id')
            .lean();
        return followers.map(f => f.follower);
    }

    getFollowing = async (userId) => {
        const following = await followModel.find({ follower: userId })
            .populate('following', 'name avatar email _id')
            .lean();
        return following.map(f => f.following);
    }

    checkFollowStatus = async (currentUserId, targetUserId) => {
        if (!currentUserId) return false;
        const follow = await followModel.findOne({ follower: currentUserId, following: targetUserId });
        return !!follow;
    }

    getMutualFriends = async (userId) => {
        const following = await followModel.find({ follower: userId }).lean();
        const followingIds = following.map(f => f.following);

        const mutualFollows = await followModel.find({
            following: userId,
            follower: { $in: followingIds }
        }).populate('follower', 'name avatar email _id').lean();

        return mutualFollows.map(f => f.follower);
    }

    getRecommendedFriends = async (userId) => {
        const following = await followModel.find({ follower: userId }).lean();
        const followingIds = following.map(f => f.following);

        const excludedIds = [...followingIds, userId];

        const recommendations = await userModel.find({
            _id: { $nin: excludedIds }
        }).select('name avatar email _id').limit(10).lean();

        return recommendations;
    }
}

module.exports = new UserService();