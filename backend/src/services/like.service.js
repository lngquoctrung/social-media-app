const likeModel = require("../models/like.model");
const postModel = require("../models/post.model");
const commentModel = require("../models/comment.model");
const { NotFoundError } = require("../core/error.response");

class LikeService {
    toggleLike = async (userId, targetId, targetType) => {
        // Verify target exists
        let target;
        if (targetType === 'Post') {
            target = await postModel.findById(targetId);
        } else if (targetType === 'Comment') {
            target = await commentModel.findById(targetId);
        }

        if (!target) throw new NotFoundError({ message: `${targetType} not found` });

        // Check if user is the owner of the target
        const ownerId = targetType === 'Post' ? target.user : target.userId;
        if (ownerId.toString() === userId.toString()) {
            throw new BadRequestError({ message: "You cannot like your own content" });
        }

        // Check if like exists
        const existingLike = await likeModel.findOne({
            user: userId,
            targetId: targetId,
            targetType: targetType
        });

        if (existingLike) {
            // Unlike
            await likeModel.findByIdAndDelete(existingLike._id);
            return { liked: false };
        } else {
            // Like
            await likeModel.create({
                user: userId,
                targetId: targetId,
                targetType: targetType
            });
            return { liked: true };
        }
    }

    getLikes = async (targetId) => {
        const likes = await likeModel.find({ targetId }).populate("user", "name avatar");
        return likes;
    }
}

module.exports = new LikeService();
