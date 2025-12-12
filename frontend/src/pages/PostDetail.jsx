import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    FaHeart,
    FaRegHeart,
    FaRegComment,
    FaShare,
    FaArrowLeft,
    FaEllipsisH,
    FaSmile,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

import { ConfirmationModal } from "../components/common/ConfirmationModal";
import { useToast } from "../context/ToastContext";

export const PostDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Swipe States
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    // Menu States
    const [showPostMenu, setShowPostMenu] = useState(false);
    const [activeCommentMenuId, setActiveCommentMenuId] = useState(null);

    // Comment Edit States
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState("");

    // Modal State
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {},
        isDanger: false,
    });

    const openModal = (config) => {
        setModalConfig({ ...config, isOpen: true });
    };

    const closeModal = () => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
    };

    const nextImage = (e) => {
        e?.stopPropagation();
        if (post.images && currentImageIndex < post.images.length - 1) {
            setCurrentImageIndex((prev) => prev + 1);
        }
    };

    const prevImage = (e) => {
        e?.stopPropagation();
        if (currentImageIndex > 0) {
            setCurrentImageIndex((prev) => prev - 1);
        }
    };

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (
            isLeftSwipe &&
            post.images &&
            currentImageIndex < post.images.length - 1
        ) {
            setCurrentImageIndex((prev) => prev + 1);
        }
        if (isRightSwipe && currentImageIndex > 0) {
            setCurrentImageIndex((prev) => prev - 1);
        }
    };

    const processComments = (rawComments) => {
        const commentMap = {};
        const roots = [];

        // First pass: map and reset children
        rawComments.forEach((c) => {
            c.children = [];
            commentMap[c._id] = c;
        });

        // Second pass: attach children
        rawComments.forEach((c) => {
            if (c.parentId && commentMap[c.parentId]) {
                commentMap[c.parentId].children.push(c);
            } else {
                roots.push(c);
            }
        });

        // Flatten
        const organized = [];
        const addNode = (node, level) => {
            node.level = level;
            organized.push(node);
            if (node.children?.length) {
                node.children.sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                );
                node.children.forEach((child) => addNode(child, level + 1));
            }
        };

        roots.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        roots.forEach((root) => addNode(root, 0));
        return organized;
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [postRes, commentsRes] = await Promise.all([
                api.get(API_ENDPOINTS.POSTS.DETAIL(id)),
                api.get(API_ENDPOINTS.COMMENTS.LIST(id)),
            ]);

            const postData = postRes.data.metadata;
            setPost(postData);
            setIsLiked(postData.isLiked || false);
            setLikesCount(postData.likesCount || 0);
            setComments(processComments(commentsRes.data.metadata || []));
        } catch (error) {
            console.error("Failed to load", error);
        } finally {
            setLoading(false);
        }
    };

    const isPostOwner = user?._id === post?.user?._id;

    // --- Post Actions ---
    const handlePostDelete = async () => {
        openModal({
            title: "Delete Post",
            message:
                "Are you sure you want to delete this post? This action cannot be undone.",
            confirmText: "Delete",
            isDanger: true,
            onConfirm: async () => {
                try {
                    await api.delete(API_ENDPOINTS.POSTS.DELETE(post._id));
                    navigate("/");
                } catch (error) {
                    console.error("Failed to delete post", error);
                }
            },
        });
    };

    const handlePostEdit = () => {
        navigate(`/post/edit/${post._id}`);
    };

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/post/${post._id}`;

        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(shareUrl);
                showToast("Link copied to clipboard!", "success");
            } catch (err) {
                console.error("Failed to copy link via navigator", err);
                fallbackCopyTextToClipboard(shareUrl);
            }
        } else {
            fallbackCopyTextToClipboard(shareUrl);
        }
    };

    const fallbackCopyTextToClipboard = (text) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;

        // Ensure textarea is not visible
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand("copy");
            if (successful) {
                showToast("Link copied to clipboard!", "success");
            } else {
                showToast("Failed to copy link", "error");
            }
        } catch (err) {
            console.error("Fallback copy failed", err);
            showToast("Failed to copy link", "error");
        }

        document.body.removeChild(textArea);
    };

    // --- Comment Actions ---
    const handleCommentDelete = async (commentId) => {
        openModal({
            title: "Delete Comment",
            message: "Are you sure you want to delete this comment?",
            confirmText: "Delete",
            isDanger: true,
            onConfirm: async () => {
                try {
                    await api.delete(API_ENDPOINTS.COMMENTS.DELETE(commentId));
                    setComments((prev) =>
                        prev.filter((c) => c._id !== commentId)
                    );
                    setActiveCommentMenuId(null);
                } catch (error) {
                    console.error("Failed to delete comment", error);
                }
            },
        });
    };

    const startEditingComment = (comment) => {
        setEditingCommentId(comment._id);
        setEditCommentContent(comment.content);
        setActiveCommentMenuId(null);
    };

    const cancelEditingComment = () => {
        setEditingCommentId(null);
        setEditCommentContent("");
    };

    const handleReply = (comment) => {
        setReplyingTo(comment);
        setNewComment(`@${comment.user?.name} `);
        // Focus input
        document
            .querySelector('input[placeholder="Add a comment..."]')
            ?.focus();
    };

    const cancelReply = () => {
        setReplyingTo(null);
        setNewComment("");
    };

    const saveEditedComment = async (commentId) => {
        if (!editCommentContent.trim()) return;
        try {
            await api.put(API_ENDPOINTS.COMMENTS.UPDATE(commentId), {
                content: editCommentContent,
            });
            setComments((prev) =>
                prev.map((c) =>
                    c._id === commentId
                        ? { ...c, content: editCommentContent }
                        : c
                )
            );
            setEditingCommentId(null);
            setEditCommentContent("");
        } catch (error) {
            console.error("Failed to update comment", error);
        }
    };

    const handleLike = async () => {
        if (!user) return navigate("/login");
        if (isPostOwner) return;

        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

        try {
            await api.post(API_ENDPOINTS.LIKES.TOGGLE, {
                targetId: id,
                targetType: "Post",
            });
        } catch {
            setIsLiked(!newIsLiked);
            setLikesCount((prev) => (newIsLiked ? prev - 1 : prev + 1));
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        setSubmitting(true);
        try {
            await api.post(API_ENDPOINTS.COMMENTS.CREATE, {
                postId: id,
                content: newComment,
                parentId: replyingTo?._id || null,
            });
            setNewComment("");
            setReplyingTo(null);
            const res = await api.get(API_ENDPOINTS.COMMENTS.LIST(id));
            setComments(processComments(res.data.metadata || []));
        } catch (error) {
            console.error("Failed to comment", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCommentLike = async (commentId, isLiked, commentOwnerId) => {
        if (!user) return navigate("/login");
        if (user._id === commentOwnerId) return;

        // Optimistic update
        setComments((prevComments) =>
            prevComments.map((c) => {
                if (c._id === commentId) {
                    return {
                        ...c,
                        isLiked: !isLiked,
                        likesCount: isLiked
                            ? c.likesCount - 1
                            : c.likesCount + 1,
                    };
                }
                return c;
            })
        );

        try {
            await api.post(API_ENDPOINTS.LIKES.TOGGLE, {
                targetId: commentId,
                targetType: "Comment",
            });
        } catch (error) {
            // Revert on error
            setComments((prevComments) =>
                prevComments.map((c) => {
                    if (c._id === commentId) {
                        return {
                            ...c,
                            isLiked: isLiked, // Revert to original state
                            likesCount: isLiked
                                ? c.likesCount + 1
                                : c.likesCount - 1,
                        };
                    }
                    return c;
                })
            );
        }
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if (loading)
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    if (!post)
        return (
            <div className="flex h-screen items-center justify-center text-red-500">
                Post not found
            </div>
        );

    return (
        <div
            onClick={() => navigate(-1)}
            className="fixed inset-0 top-0 md:top-[64px] z-50 flex items-center justify-center bg-[#0f0f14]/90 p-0 md:p-4 backdrop-blur-sm cursor-pointer overflow-hidden"
        >
            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                isDanger={modalConfig.isDanger}
            />
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex h-dvh md:h-[85vh] w-full md:max-w-6xl overflow-hidden md:rounded-xl border-none md:border border-[#3a3a4a] bg-[#1a1a24] shadow-2xl md:flex-row flex-col cursor-auto relative"
            >
                {/* Left Side: Image Carousel (Desktop Only) */}
                <div className="relative hidden md:flex h-[40vh] md:h-full w-full items-center justify-center bg-black md:w-[60%] lg:w-[65%] group">
                    {post.images && post.images.length > 0 ? (
                        <>
                            <img
                                src={post.images[currentImageIndex]}
                                alt={`Post ${currentImageIndex + 1}`}
                                className="h-full w-full object-contain transition-opacity duration-300"
                            />

                            {/* Navigation Buttons */}
                            {post.images.length > 1 && (
                                <>
                                    {currentImageIndex > 0 && (
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 backdrop-blur-xs transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
                                        >
                                            <FaChevronLeft size={20} />
                                        </button>
                                    )}
                                    {currentImageIndex <
                                        post.images.length - 1 && (
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 backdrop-blur-xs transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
                                        >
                                            <FaChevronRight size={20} />
                                        </button>
                                    )}

                                    {/* Dots Indicator */}
                                    <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-xs z-10">
                                        {post.images.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`h-2 w-2 rounded-full transition-all ${
                                                    idx === currentImageIndex
                                                        ? "bg-white scale-110"
                                                        : "bg-white/50"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="text-gray-500">No Image</div>
                    )}
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 md:hidden"
                    >
                        <FaArrowLeft />
                    </button>
                </div>

                {/* Right Side: Content */}
                <div className="flex flex-1 min-h-0 w-full flex-col bg-[#22222e] md:w-[40%] lg:w-[35%]">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[#3a3a4a] p-4 relative">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate(-1)}
                                className="mr-2 text-white md:hidden"
                            >
                                <FaArrowLeft />
                            </button>
                            <Link to={`/profile/${post.user?._id}`}>
                                <img
                                    src={
                                        post.user?.avatar ||
                                        `https://ui-avatars.com/api/?name=${post.user?.name}&background=random`
                                    }
                                    alt=""
                                    className="h-9 w-9 rounded-full object-cover ring-2 ring-[#3a3a4a]"
                                />
                            </Link>
                            <div>
                                <Link
                                    to={`/profile/${post.user?._id}`}
                                    className="block text-sm font-semibold text-white hover:text-[#a855f7]"
                                >
                                    {post.user?.name}
                                </Link>
                                {post.location && (
                                    <span className="text-xs text-[#6a6a7a]">
                                        {post.location}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Post Menu */}
                        {isPostOwner && (
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setShowPostMenu(!showPostMenu)
                                    }
                                    className="cursor-pointer text-[#6a6a7a] hover:text-white p-2"
                                >
                                    <FaEllipsisH />
                                </button>
                                {showPostMenu && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() =>
                                                setShowPostMenu(false)
                                            }
                                        />
                                        <div className="absolute right-0 top-full mt-2 w-32 rounded-lg border border-[#3a3a4a] bg-[#1a1a24] shadow-xl z-20 overflow-hidden">
                                            <button
                                                onClick={() => {
                                                    setShowPostMenu(false);
                                                    handlePostEdit();
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#2a2a38]"
                                            >
                                                Edit Post
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowPostMenu(false);
                                                    handlePostDelete();
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-[#2a2a38]"
                                            >
                                                Delete Post
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-4 scrollbar-thin scrollbar-thumb-[#3a3a4a] scrollbar-track-transparent">
                        {/* Mobile Image View (Inline) - Moved above content */}
                        {post.images && post.images.length > 0 && (
                            <div
                                className="relative mb-4 block md:hidden -mx-4 mt-0 bg-black group"
                                onTouchStart={onTouchStart}
                                onTouchMove={onTouchMove}
                                onTouchEnd={onTouchEnd}
                            >
                                <img
                                    src={post.images[currentImageIndex]}
                                    alt={`Post ${currentImageIndex + 1}`}
                                    className="w-full h-auto max-h-[60vh] object-contain"
                                />

                                {/* Mobile Navigation Buttons */}
                                {post.images.length > 1 && (
                                    <>
                                        {currentImageIndex > 0 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCurrentImageIndex(
                                                        (prev) => prev - 1
                                                    );
                                                }}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 backdrop-blur-xs transition-opacity"
                                            >
                                                <FaChevronLeft size={16} />
                                            </button>
                                        )}
                                        {currentImageIndex <
                                            post.images.length - 1 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCurrentImageIndex(
                                                        (prev) => prev + 1
                                                    );
                                                }}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 backdrop-blur-xs transition-opacity"
                                            >
                                                <FaChevronRight size={16} />
                                            </button>
                                        )}
                                    </>
                                )}

                                {post.images.length > 1 && (
                                    <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/30 px-2 py-1 backdrop-blur-xs">
                                        {post.images.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`h-1.5 w-1.5 rounded-full transition-all ${
                                                    idx === currentImageIndex
                                                        ? "bg-white scale-110"
                                                        : "bg-white/40"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mobile Action Buttons (Below Image) */}
                        <div className="flex md:hidden flex-col gap-2 mb-4">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleLike}
                                    disabled={isPostOwner}
                                    className={`text-2xl hover:opacity-80 ${
                                        isPostOwner
                                            ? "opacity-50 cursor-not-allowed hover:opacity-50"
                                            : ""
                                    }`}
                                >
                                    {isLiked ? (
                                        <FaHeart className="text-pink-500" />
                                    ) : (
                                        <FaRegHeart className="text-white" />
                                    )}
                                </button>
                                <button className="text-2xl text-white hover:opacity-80">
                                    <FaRegComment />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="text-2xl text-white hover:opacity-80"
                                >
                                    <FaShare />
                                </button>
                            </div>
                            <div className="">
                                <p className="font-semibold text-white">
                                    {likesCount.toLocaleString()} likes
                                </p>
                            </div>
                        </div>

                        {/* Original Post Content (Simplified for Mobile) */}
                        {post.content && (
                            <div className="mb-4">
                                <div className="flex gap-3 mb-3">
                                    {/* Hide avatar on mobile since it's in the header */}
                                    <Link
                                        to={`/profile/${post.user?._id}`}
                                        className="hidden md:block"
                                    >
                                        <img
                                            src={
                                                post.user?.avatar ||
                                                `https://ui-avatars.com/api/?name=${post.user?.name}&background=random`
                                            }
                                            alt=""
                                            className="h-8 w-8 shrink-0 rounded-full"
                                        />
                                    </Link>
                                    <div className="flex-1">
                                        <div className="text-sm">
                                            <Link
                                                to={`/profile/${post.user?._id}`}
                                                className="mr-2 font-semibold text-white hover:underline hidden md:inline"
                                            >
                                                {post.user?.name}
                                            </Link>
                                            <span className="text-[#e4e4e7]">
                                                {post.content}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex items-center gap-4 text-xs text-[#6a6a7a]">
                                            <span>
                                                {formatTime(post.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {comments.map((c) => {
                            const isCommentOwner = user?._id === c.user?._id;
                            const isEditing = editingCommentId === c._id;
                            const level = c.level || 0;
                            const indentLevel = Math.min(level, 1);

                            return (
                                <div
                                    key={c._id}
                                    className="flex gap-3 group/comment"
                                    style={{
                                        marginLeft: `${indentLevel * 32}px`,
                                    }}
                                >
                                    <Link to={`/profile/${c.user?._id}`}>
                                        <img
                                            src={
                                                c.user?.avatar ||
                                                `https://ui-avatars.com/api/?name=${c.user?.name}&background=random`
                                            }
                                            alt=""
                                            className="h-8 w-8 shrink-0 rounded-full"
                                        />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm group relative">
                                            <Link
                                                to={`/profile/${c.user?._id}`}
                                                className="mr-2 font-semibold text-white hover:text-[#a855f7]"
                                            >
                                                {c.user?.name}
                                            </Link>

                                            {isEditing ? (
                                                <div className="mt-1">
                                                    <textarea
                                                        value={
                                                            editCommentContent
                                                        }
                                                        onChange={(e) =>
                                                            setEditCommentContent(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full rounded bg-[#2a2a38] p-2 text-white focus:outline-none focus:ring-1 focus:ring-[#a855f7]"
                                                        rows={2}
                                                    />
                                                    <div className="mt-2 flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                saveEditedComment(
                                                                    c._id
                                                                )
                                                            }
                                                            className="text-xs text-[#a855f7] hover:underline"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={
                                                                cancelEditingComment
                                                            }
                                                            className="text-xs text-[#6a6a7a] hover:text-white"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-[#e4e4e7]">
                                                    {c.content}
                                                </span>
                                            )}

                                            {/* Comment Menu Button */}
                                            {!isEditing && isCommentOwner && (
                                                <div className="absolute right-0 top-0 opacity-100 md:opacity-0 md:group-hover/comment:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() =>
                                                            setActiveCommentMenuId(
                                                                activeCommentMenuId ===
                                                                    c._id
                                                                    ? null
                                                                    : c._id
                                                            )
                                                        }
                                                        className="text-[#6a6a7a] hover:text-white p-1"
                                                    >
                                                        <FaEllipsisH
                                                            size={12}
                                                        />
                                                    </button>
                                                    {activeCommentMenuId ===
                                                        c._id && (
                                                        <>
                                                            <div
                                                                className="fixed inset-0 z-10"
                                                                onClick={() =>
                                                                    setActiveCommentMenuId(
                                                                        null
                                                                    )
                                                                }
                                                            />
                                                            <div className="absolute right-0 top-full mt-1 w-24 rounded border border-[#3a3a4a] bg-[#1a1a24] shadow-xl z-20 overflow-hidden">
                                                                <button
                                                                    onClick={() =>
                                                                        startEditingComment(
                                                                            c
                                                                        )
                                                                    }
                                                                    className="w-full px-3 py-1.5 text-left text-xs text-white hover:bg-[#2a2a38]"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleCommentDelete(
                                                                            c._id
                                                                        )
                                                                    }
                                                                    className="w-full px-3 py-1.5 text-left text-xs text-red-500 hover:bg-[#2a2a38]"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {!isEditing && (
                                            <div className="mt-1 flex items-center gap-3 text-xs text-[#6a6a7a]">
                                                <span>
                                                    {formatTime(c.createdAt)}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleReply(c)
                                                    }
                                                    className="font-semibold hover:text-white"
                                                >
                                                    Reply
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleCommentLike(
                                                            c._id,
                                                            c.isLiked,
                                                            c.user?._id
                                                        )
                                                    }
                                                    disabled={isCommentOwner}
                                                    className={`flex items-center gap-1 font-semibold hover:text-white ${
                                                        c.isLiked
                                                            ? "text-pink-500"
                                                            : ""
                                                    } ${
                                                        isCommentOwner
                                                            ? "opacity-50 cursor-not-allowed hover:text-[#b8b8c8]"
                                                            : ""
                                                    }`}
                                                >
                                                    {c.isLiked ? (
                                                        <FaHeart />
                                                    ) : (
                                                        <FaRegHeart />
                                                    )}
                                                    {c.likesCount > 0 && (
                                                        <span>
                                                            {c.likesCount}
                                                        </span>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer Actions (Desktop Only) */}
                    <div className="hidden md:block border-t border-[#3a3a4a] bg-[#22222e]">
                        <div className="flex items-center gap-4 p-4">
                            <button
                                onClick={handleLike}
                                disabled={isPostOwner}
                                className={`text-2xl hover:opacity-80 ${
                                    isPostOwner
                                        ? "opacity-50 cursor-not-allowed hover:opacity-50"
                                        : ""
                                }`}
                            >
                                {isLiked ? (
                                    <FaHeart className="text-pink-500" />
                                ) : (
                                    <FaRegHeart className="text-white" />
                                )}
                            </button>
                            <button className="text-2xl text-white hover:opacity-80">
                                <FaRegComment />
                            </button>
                            <button
                                onClick={handleShare}
                                className="text-2xl text-white hover:opacity-80"
                            >
                                <FaShare />
                            </button>
                        </div>
                        <div className="px-4 pb-2">
                            <p className="font-semibold text-white">
                                {likesCount.toLocaleString()} likes
                            </p>
                            <p className="text-[10px] uppercase text-[#6a6a7a]">
                                {formatTime(post.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Input Area (Visible on all devices) */}
                    <div className="border-t border-[#3a3a4a] bg-[#22222e]">
                        {replyingTo && (
                            <div className="flex items-center justify-between border-t border-[#3a3a4a] bg-[#1a1a24] px-4 py-2 text-xs">
                                <span className="text-[#a855f7]">
                                    Replying to <b>{replyingTo.user?.name}</b>
                                </span>
                                <button
                                    onClick={cancelReply}
                                    className="text-[#6a6a7a] hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                        <form
                            onSubmit={handleCommentSubmit}
                            className="flex items-center border-t border-[#3a3a4a] p-3 md:p-4"
                        >
                            <button
                                type="button"
                                className="pr-3 text-2xl text-[#6a6a7a] hover:text-white"
                            >
                                <FaSmile />
                            </button>
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                className="flex-1 bg-transparent text-sm text-white placeholder-[#6a6a7a] focus:outline-none"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim() || submitting}
                                className="font-semibold text-[#a855f7] hover:text-[#c084fc] disabled:opacity-50"
                            >
                                Post
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
