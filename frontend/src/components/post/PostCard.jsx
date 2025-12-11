import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaHeart,
    FaRegHeart,
    FaRegComment,
    FaShare,
    FaEllipsisH,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";
import { ConfirmationModal } from "../common/ConfirmationModal";

export const PostCard = ({ post, onDelete }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(post.isLiked || false);
    const [likesCount, setLikesCount] = useState(post.likesCount || 0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const nextImage = (e) => {
        e.stopPropagation();
        if (post.images && currentImageIndex < post.images.length - 1) {
            setCurrentImageIndex((prev) => prev + 1);
        }
    };

    const prevImage = (e) => {
        e.stopPropagation();
        if (currentImageIndex > 0) {
            setCurrentImageIndex((prev) => prev - 1);
        }
    };

    const isOwner = user?._id === post.user?._id;

    const confirmDelete = async () => {
        try {
            await api.delete(API_ENDPOINTS.POSTS.DELETE(post._id));
            if (onDelete) onDelete(post._id);
        } catch (error) {
            console.error("Failed to delete post", error);
        }
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const handleEdit = () => {
        navigate(`/post/edit/${post._id}`);
    };

    const handleLike = async (e) => {
        e?.stopPropagation(); // Prevent navigation when clicking like
        if (!user) {
            navigate("/login");
            return;
        }

        if (isOwner) return;

        setIsAnimating(true);
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

        setTimeout(() => setIsAnimating(false), 400);

        try {
            await api.post(API_ENDPOINTS.LIKES.TOGGLE, {
                targetId: post._id,
                targetType: "Post",
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
        <>
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Post"
                message="Are you sure you want to delete this post? This action cannot be undone."
                confirmText="Delete"
                isDanger={true}
            />
            <div className="card-glass mb-6 overflow-hidden rounded-2xl border border-[#3a3a4a] bg-[#22222e]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 relative">
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
                    {isOwner && (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="text-[#6a6a7a] hover:text-white p-2"
                            >
                                <FaEllipsisH />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 top-full mt-2 w-32 rounded-lg border border-[#3a3a4a] bg-[#1a1a24] shadow-xl z-10 overflow-hidden">
                                    <button
                                        onClick={() => {
                                            setShowMenu(false);
                                            handleEdit();
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#2a2a38]"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowMenu(false);
                                            handleDelete();
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-[#2a2a38]"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                            {/* Overlay to close menu */}
                            {showMenu && (
                                <div
                                    className="fixed inset-0 z-0"
                                    onClick={() => setShowMenu(false)}
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Content Text */}
                {post.content && (
                    <div className="px-4 pb-3">
                        <p className="text-base text-[#e4e4e7]">
                            {post.content}
                        </p>
                    </div>
                )}

                {/* Image Carousel */}
                {post.images && post.images.length > 0 && (
                    <div className="relative w-full bg-[#1a1a24] hover:opacity-95 active:opacity-90 group">
                        <div
                            onClick={goToDetail}
                            className="cursor-pointer"
                        >
                            <img
                                src={post.images[currentImageIndex]}
                                alt={`Post content ${currentImageIndex + 1}`}
                                className="w-full object-cover transition-opacity duration-300"
                                style={{
                                    maxHeight: "600px",
                                    minHeight: "300px",
                                }}
                                loading="lazy"
                            />
                        </div>

                        {isAnimating && (
                            <div className="absolute inset-0 flex items-center justify-center animate-like pointer-events-none">
                                <FaHeart className="h-24 w-24 text-white drop-shadow-xl" />
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        {post.images.length > 1 && (
                            <>
                                {currentImageIndex > 0 && (
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <FaChevronLeft size={16} />
                                    </button>
                                )}
                                {currentImageIndex < post.images.length - 1 && (
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <FaChevronRight size={16} />
                                    </button>
                                )}

                                {/* Dots Indicator */}
                                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/40 px-2 py-1 backdrop-blur-xs">
                                    {post.images.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1.5 w-1.5 rounded-full transition-all ${
                                                idx === currentImageIndex
                                                    ? "bg-white scale-110"
                                                    : "bg-white/50"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Footer Actions */}
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between border-t border-[#3a3a4a] pt-3">
                        <div className="flex gap-6">
                            <button
                                onClick={handleLike}
                                disabled={isOwner}
                                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                                    isLiked
                                        ? "text-pink-500"
                                        : "text-[#b8b8c8] hover:text-white"
                                } ${
                                    isOwner
                                        ? "opacity-50 cursor-not-allowed hover:text-[#b8b8c8]"
                                        : ""
                                }`}
                            >
                                {isLiked ? (
                                    <FaHeart className="text-lg" />
                                ) : (
                                    <FaRegHeart className="text-lg" />
                                )}
                                <span>
                                    {likesCount > 0 ? likesCount : "Like"}
                                </span>
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
        </>
    );
};
