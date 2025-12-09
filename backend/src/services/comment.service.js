const commentModel = require("../models/comment.model");
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

    getCommentsByPost = async (postId) => {
        // Return flat list, let frontend handle nesting or simple display
        // Populate user info
        const comments = await commentModel.find({ postId: postId })
            .sort({ createdAt: 1 }) // Chronological order usually better for comments, or -1 for newest first. keeping 1 for thread flow.
            .populate("userId", "name avatar") // Select name and avatar from user
            .lean();

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
