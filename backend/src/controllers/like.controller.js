const likeService = require('../services/like.service');
const { Ok } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");

const toggleLike = async (req, res) => {
    const { userId } = req.user;
    const { targetId, targetType } = req.body;

    if (!['Post', 'Comment'].includes(targetType)) {
        throw new BadRequestError({ message: "Invalid target type. Must be 'Post' or 'Comment'" });
    }

    const result = await likeService.toggleLike(userId, targetId, targetType);
    new Ok({
        message: result.liked ? "Liked successfully" : "Unliked successfully",
        metadata: result,
    }).send(res);
}

const getLikes = async (req, res) => {
    const { targetId } = req.params;
    const likes = await likeService.getLikes(targetId);
    new Ok({
        message: "Get likes successfully",
        metadata: likes,
    }).send(res);
}

module.exports = {
    toggleLike,
    getLikes
};
