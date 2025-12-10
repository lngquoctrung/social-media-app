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
} from "react-icons/fa";
import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

export const PostDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

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
            setComments(commentsRes.data.metadata || []);
        } catch (error) {
            console.error("Failed to load", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!user) return navigate("/login");

        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

        try {
            await api.post(API_ENDPOINTS.LIKES.TOGGLE, {
                targetId: id,
                targetType: "post",
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
            });
            setNewComment("");
            const res = await api.get(API_ENDPOINTS.COMMENTS.LIST(id));
            setComments(res.data.metadata || []);
        } catch (error) {
            console.error("Failed to comment", error);
        } finally {
            setSubmitting(false);
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
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#0f0f14] p-4">
            {/* Modal Container */}
            <div className="flex h-[85vh] w-full max-w-6xl overflow-hidden rounded-xl border border-[#3a3a4a] bg-[#1a1a24] shadow-2xl md:flex-row flex-col">
                {/* Left Side: Image */}
                <div className="relative flex h-full w-full items-center justify-center bg-black md:w-[60%] lg:w-[65%]">
                    {post.images && post.images.length > 0 ? (
                        <img
                            src={post.images[0]}
                            alt="Post"
                            className="h-full w-full object-contain"
                        />
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
                <div className="flex h-full w-full flex-col bg-[#22222e] md:w-[40%] lg:w-[35%]">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[#3a3a4a] p-4">
                        <div className="flex items-center gap-3">
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
                        <FaEllipsisH className="cursor-pointer text-[#6a6a7a] hover:text-white" />
                    </div>

                    {/* Comments Scroll Area */}
                    <div className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-[#3a3a4a] scrollbar-track-transparent">
                        {/* Original Post Capacitor */}
                        {post.content && (
                            <div className="flex gap-3">
                                <img
                                    src={
                                        post.user?.avatar ||
                                        `https://ui-avatars.com/api/?name=${post.user?.name}&background=random`
                                    }
                                    alt=""
                                    className="h-8 w-8 shrink-0 rounded-full"
                                />
                                <div className="flex-1">
                                    <div className="text-sm">
                                        <span className="mr-2 font-semibold text-white">
                                            {post.user?.name}
                                        </span>
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
                        )}

                        {/* Comments List */}
                        {comments.map((c) => (
                            <div
                                key={c._id}
                                className="flex gap-3"
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
                                <div className="flex-1">
                                    <div className="text-sm">
                                        <Link
                                            to={`/profile/${c.user?._id}`}
                                            className="mr-2 font-semibold text-white hover:text-[#a855f7]"
                                        >
                                            {c.user?.name}
                                        </Link>
                                        <span className="text-[#e4e4e7]">
                                            {c.content}
                                        </span>
                                    </div>
                                    <div className="mt-1 flex items-center gap-3 text-xs text-[#6a6a7a]">
                                        <span>{formatTime(c.createdAt)}</span>
                                        <button className="font-semibold hover:text-white">
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-[#3a3a4a] bg-[#22222e]">
                        <div className="flex items-center gap-4 p-4">
                            <button
                                onClick={handleLike}
                                className="text-2xl hover:opacity-80"
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
                            <button className="text-2xl text-white hover:opacity-80">
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

                        {/* Input Area */}
                        <form
                            onSubmit={handleCommentSubmit}
                            className="flex items-center border-t border-[#3a3a4a] p-3"
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
