const postModel = require('../models/post.model');
const mongoose = require('mongoose');
const path = require("path");
const config = require("../config");
const { moveFile, removeFile } = require("../utils/file.util");

const { NotFoundError, ForbiddenError } = require("../core/error.response");

class PostService {
    getAllPosts = async (currentUserId, filterUserId) => {
        const pipeline = [
            ...(filterUserId ? [{
                $match: { user: new mongoose.Types.ObjectId(filterUserId) }
            }] : []),
            {
                $lookup: {
                    from: 'Users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $lookup: {
                    from: 'Likes',
                    let: { postId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$targetId', '$$postId'] },
                                        { $eq: ['$targetType', 'Post'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'likes'
                }
            },
            {
                $lookup: {
                    from: 'Comments',
                    let: { postId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$post', '$$postId'] } } },
                        { $count: 'count' }
                    ],
                    as: 'commentsData'
                }
            },
            {
                $addFields: {
                    likesCount: { $size: '$likes' },
                    commentsCount: { $ifNull: [{ $arrayElemAt: ['$commentsData.count', 0] }, 0] },
                    isLiked: {
                        $cond: {
                            if: {
                                $and: [
                                    !!currentUserId,
                                    { $in: [currentUserId ? new mongoose.Types.ObjectId(currentUserId) : null, '$likes.user'] }
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
                    commentsData: 0,
                    'user.password': 0
                }
            },
            { $sort: { createdAt: -1 } }
        ];

        const posts = await postModel.aggregate(pipeline);
        return posts;
    }

    getPostById = async (postId, userId) => {
        const pipeline = [
            {
                $match: { _id: new mongoose.Types.ObjectId(postId) }
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $lookup: {
                    from: 'Likes',
                    let: { postId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$targetId', '$$postId'] },
                                        { $eq: ['$targetType', 'Post'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'likes'
                }
            },
            {
                $lookup: {
                    from: 'Comments',
                    let: { postId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$post', '$$postId'] } } },
                        { $count: 'count' }
                    ],
                    as: 'commentsData'
                }
            },
            {
                $addFields: {
                    likesCount: { $size: '$likes' },
                    commentsCount: { $ifNull: [{ $arrayElemAt: ['$commentsData.count', 0] }, 0] },
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
                    commentsData: 0,
                    'user.password': 0
                }
            }
        ];

        const posts = await postModel.aggregate(pipeline);
        if (!posts || posts.length === 0) {
            throw new NotFoundError({ message: "Post not found" });
        }
        return posts[0];
    }

    createPost = async (userId, data) => {
        const imageUrls = [];

        if (data?.images && data.images.length > 0) {
            await Promise.all(data.images.map(async (filename) => {
                const tempPath = path.join(config.uploader.tempFolders.post, filename);
                const destPath = path.join(config.uploader.post.destination, filename);

                const imageUrl = `/public/images/posts/${filename}`;
                imageUrls.push(imageUrl);

                await moveFile(tempPath, destPath);
            }));
        }

        const post = await postModel.create({
            content: data.content,
            user: userId,
            images: imageUrls
        });
        return post;
    }

    updatePost = async (userId, postId, data) => {
        const post = await postModel.findById(postId);
        if (!post) throw new NotFoundError({ message: "Post not found" });
        if (post.user.toString() !== userId) throw new ForbiddenError({ message: "Unauthorized" });

        const apiPrefix = `${config.app.API_PREFIX}/${config.app.API_VERSION}`;
        const incomingImages = data.images || [];
        const currentDbImages = post.images || [];

        const imagesToDelete = currentDbImages.filter(dbImg => !incomingImages.includes(dbImg));

        if (imagesToDelete.length > 0) {
            imagesToDelete.forEach(imgUrl => {
                const filename = path.basename(imgUrl);
                removeFile(path.join(config.uploader.post.destination, filename)).catch(console.error);
            });
        }

        const finalImageUrls = [];

        for (const item of incomingImages) {
            if (item.startsWith("http")) {
                finalImageUrls.push(item);
            } else {
                const filename = item;
                const tempPath = path.join(config.uploader.tempFolders.post, filename);
                const destPath = path.join(config.uploader.post.destination, filename);

                await moveFile(tempPath, destPath);

                const newUrl = `/public/images/posts/${filename}`;
                finalImageUrls.push(newUrl);
            }
        }

        const updatedPost = await postModel.findByIdAndUpdate(
            postId,
            { ...data, images: finalImageUrls },
            { new: true }
        );
        return updatedPost;
    }

    deletePost = async (userId, postId) => {
        const post = await postModel.findById(postId);
        if (!post) throw new NotFoundError({ message: "Post not found" });
        if (post.user.toString() !== userId) throw new ForbiddenError({ message: "Unauthorized" });

        // Delete all images
        if (post.images && post.images.length > 0) {
            for (const imgUrl of post.images) {
                const filename = path.basename(imgUrl);
                await removeFile(path.join(config.uploader.post.destination, filename));
            }
        }

        await postModel.findByIdAndDelete(postId);
        return true;
    }
}

module.exports = new PostService();