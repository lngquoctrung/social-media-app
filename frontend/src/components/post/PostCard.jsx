import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaHeart,
    FaRegHeart,
    FaRegComment,
    FaBookmark,
    FaRegBookmark,
    FaShare,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";

export const PostCard = ({ post }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(post.isLiked || false);
    const [likesCount, setLikesCount] = useState(post.likesCount || 0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleLike = async (e) => {
        e?.preventDefault();
        if (!user) {
            navigate("/login");
            return;
        }

        setIsAnimating(true);
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

        setTimeout(() => setIsAnimating(false), 400);

        try {
            await api.post(API_ENDPOINTS.LIKES.TOGGLE, {
                targetId: post._id,
                targetType: "post",
            });
        } catch (error) {
            setIsLiked(!newIsLiked);
            setLikesCount((prev) => (newIsLiked ? prev - 1 : prev + 1));
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return "Just now";
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    return (
        <article className="card overflow-hidden animate-fadeIn hover-lift">
            {/* Header */}
            <div className="flex items-center gap-3 p-4">
                <Link
                    to={`/profile/${post.user?._id}`}
                    className="avatar-ring"
                >
                    <img
                        src={
                            post.user?.avatar ||
                            `https://ui-avatars.com/api/?name=${
                                post.user?.name || "U"
                            }&background=6366f1&color=fff`
                        }
                        alt={post.user?.name}
                        className="h-10 w-10 rounded-full object-cover"
                    />
                </Link>
                <div className="flex-1">
                    <Link
                        to={`/profile/${post.user?._id}`}
                        className="block text-sm font-semibold text-white hover:text-[#a855f7]"
                    >
                        {post.user?.name || "Unknown"}
                    </Link>
                    <span className="text-xs text-[#6a6a7a]">
                        {formatTime(post.createdAt)}
                    </span>
                </div>
            </div>

            {/* Image */}
            {post.images && post.images.length > 0 && (
                <Link
                    to={`/post/${post._id}`}
                    className="block"
                    onDoubleClick={() => !isLiked && user && handleLike()}
                >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1a1a24]">
                        <img
                            src={post.images[0]}
                            alt="Post"
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                            loading="lazy"
                        />
                        {isAnimating && isLiked && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <FaHeart className="h-20 w-20 text-pink-500 animate-like drop-shadow-lg" />
                            </div>
                        )}
                    </div>
                </Link>
            )}

            {/* Content & Actions */}
            <div className="p-4">
                {/* Actions Row */}
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLike}
                            className={`transition-transform hover:scale-110 ${
                                isAnimating ? "animate-like" : ""
                            }`}
                        >
                            {isLiked ? (
                                <FaHeart className="h-6 w-6 text-pink-500" />
                            ) : (
                                <FaRegHeart className="h-6 w-6 text-[#b8b8c8] hover:text-white" />
                            )}
                        </button>
                        <Link
                            to={`/post/${post._id}`}
                            className="text-[#b8b8c8] hover:text-white"
                        >
                            <FaRegComment className="h-6 w-6" />
                        </Link>
                        <button className="text-[#b8b8c8] hover:text-white">
                            <FaShare className="h-5 w-5" />
                        </button>
                    </div>
                    <button
                        onClick={() => setIsSaved(!isSaved)}
                        className="text-[#b8b8c8] hover:text-white"
                    >
                        {isSaved ? (
                            <FaBookmark className="h-5 w-5 text-purple-400" />
                        ) : (
                            <FaRegBookmark className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {/* Likes */}
                <p className="mb-2 text-sm font-semibold text-white">
                    {likesCount.toLocaleString()}{" "}
                    {likesCount === 1 ? "like" : "likes"}
                </p>

                {/* Caption */}
                {post.content && (
                    <p className="text-sm text-[#b8b8c8]">
                        <Link
                            to={`/profile/${post.user?._id}`}
                            className="mr-2 font-semibold text-white hover:text-[#a855f7]"
                        >
                            {post.user?.name}
                        </Link>
                        {post.content.length > 100
                            ? `${post.content.slice(0, 100)}...`
                            : post.content}
                    </p>
                )}

                {/* Comments link */}
                {post.commentsCount > 0 && (
                    <Link
                        to={`/post/${post._id}`}
                        className="mt-2 block text-sm text-[#6a6a7a] hover:text-[#b8b8c8]"
                    >
                        View all {post.commentsCount} comments
                    </Link>
                )}
            </div>
        </article>
    );
};
