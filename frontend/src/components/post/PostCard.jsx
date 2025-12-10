import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaHeart,
    FaRegHeart,
    FaRegComment,
    FaShare,
    FaEllipsisH,
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

    const handleLike = async (e) => {
        e?.stopPropagation(); // Prevent navigation when clicking like
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

    const goToDetail = () => {
        navigate(`/post/${post._id}`);
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return "Just now";
        if (diff < 3600) return `${Math.floor(diff / 60)} m`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="card-glass mb-6 overflow-hidden rounded-2xl border border-[#3a3a4a] bg-[#22222e]">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <Link
                        to={`/profile/${post.user?._id}`}
                        className="avatar-ring"
                    >
                        <img
                            src={
                                post.user?.avatar ||
                                `https://ui-avatars.com/api/?name=${
                                    post.user?.name || "U"
                                }&background=random`
                            }
                            alt={post.user?.name}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                    </Link>
                    <div>
                        <Link
                            to={`/profile/${post.user?._id}`}
                            className="block font-semibold text-white hover:text-[#a855f7]"
                        >
                            {post.user?.name || "Unknown User"}
                        </Link>
                        <span className="text-xs text-[#6a6a7a]">
                            {formatTime(post.createdAt)}
                        </span>
                    </div>
                </div>
                <button className="text-[#6a6a7a] hover:text-white">
                    <FaEllipsisH />
                </button>
            </div>

            {/* Content Text */}
            {post.content && (
                <div className="px-4 pb-3">
                    <p className="text-base text-[#e4e4e7]">{post.content}</p>
                </div>
            )}

            {/* Image */}
            {post.images && post.images.length > 0 && (
                <div
                    onClick={goToDetail}
                    className="relative w-full cursor-pointer bg-[#1a1a24] hover:opacity-95 active:opacity-90"
                >
                    <img
                        src={post.images[0]}
                        alt="Post content"
                        className="w-full object-cover"
                        style={{ maxHeight: "600px", minHeight: "300px" }}
                        loading="lazy"
                    />
                    {isAnimating && (
                        <div className="absolute inset-0 flex items-center justify-center animate-like">
                            <FaHeart className="h-24 w-24 text-white drop-shadow-xl" />
                        </div>
                    )}
                </div>
            )}

            {/* Footer Actions */}
            <div className="px-4 py-3">
                <div className="flex items-center justify-between border-t border-[#3a3a4a] pt-3">
                    <div className="flex gap-6">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                                isLiked
                                    ? "text-pink-500"
                                    : "text-[#b8b8c8] hover:text-white"
                            }`}
                        >
                            {isLiked ? (
                                <FaHeart className="text-lg" />
                            ) : (
                                <FaRegHeart className="text-lg" />
                            )}
                            <span>{likesCount > 0 ? likesCount : "Like"}</span>
                        </button>

                        <Link
                            to={`/post/${post._id}`}
                            className="flex items-center gap-2 text-sm font-medium text-[#b8b8c8] transition-colors hover:text-white"
                        >
                            <FaRegComment className="text-lg" />
                            <span>
                                {post.commentsCount > 0
                                    ? post.commentsCount
                                    : "Comment"}
                            </span>
                        </Link>

                        <button className="flex items-center gap-2 text-sm font-medium text-[#b8b8c8] transition-colors hover:text-white">
                            <FaShare className="text-lg" />
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
