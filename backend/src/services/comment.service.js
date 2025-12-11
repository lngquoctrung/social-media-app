const commentModel = require("../models/comment.model");
const mongoose = require('mongoose');
const postModel = require("../models/post.model");
const { NotFoundError, ForbiddenError } = require("../core/error.response");

class CommentService {
    createComment = async (userId, { postId, content, parentId = null }) => {
        const post = await postModel.findById(postId);
        if (!post) throw new NotFoundError({ message: "Post not found" });

        if (parentId) {
            const parentComment = await commentModel.findById(parentId);
            if (!parentComment) throw new NotFoundError({ message: "Parent comment not found" });
        }

        const newComment = await commentModel.create({
            content,
            postId,
            userId,
            parentId
        });

        // Populate user details for immediate display
        await newComment.populate("userId", "name avatar");

        return newComment;
    }

    getCommentsByPost = async (postId, userId) => {
        const pipeline = [
            {
                $match: { postId: new mongoose.Types.ObjectId(postId) }
            },
            {
                $sort: { createdAt: 1 }
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $lookup: {
                    from: 'Likes',
                    let: { commentId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$targetId', '$$commentId'] },
                                        { $eq: ['$targetType', 'Comment'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'likes'
                }
            },
            {
                $addFields: {
                    likesCount: { $size: '$likes' },
                    isLiked: {
                        $cond: {
                            if: {
                                $and: [
                                    !!userId,
                                    { $in: [userId ? new mongoose.Types.ObjectId(userId) : null, '$likes.user'] }
                                ]
                            },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    likes: 0,
                    'user.password': 0
                }
            }
        ];

        const comments = await commentModel.aggregate(pipeline);
        return comments;
    }

    deleteComment = async (userId, commentId) => {
        const comment = await commentModel.findById(commentId);
        if (!comment) throw new NotFoundError({ message: "Comment not found" });

        // Check ownership
        if (comment.userId.toString() !== userId) {
            throw new ForbiddenError({ message: "You are not authorized to delete this comment" });
        }

        // Cascade delete: Delete all children
        await this.deleteCommentsRecursively(commentId);

        return true;
    }

    updateComment = async (userId, commentId, content) => {
        const comment = await commentModel.findById(commentId);
        if (!comment) throw new NotFoundError({ message: "Comment not found" });

        if (comment.userId.toString() !== userId) {
            throw new ForbiddenError({ message: "You are not authorized to update this comment" });
        }

        comment.content = content;
        await comment.save();
        return comment;
    }

    // Helper to delete recursively
    deleteCommentsRecursively = async (commentId) => {
        // Find children
        const children = await commentModel.find({ parentId: commentId });

        for (const child of children) {
            await this.deleteCommentsRecursively(child._id);
        }

        // Delete self
        await commentModel.findByIdAndDelete(commentId);
    }
}

module.exports = new CommentService();
