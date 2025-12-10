import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    FaHeart,
    FaRegHeart,
    FaRegComment,
    FaBookmark,
    FaShare,
    FaEllipsisH,
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-[#ef4444]">Post not found</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 pb-24 md:pb-8">
            <div className="card-glass overflow-hidden lg:flex">
                {/* Image */}
                <div className="aspect-square w-full bg-[#1a1a24] lg:w-[60%]">
                    {post.images && post.images.length > 0 ? (
                        <img
                            src={post.images[0]}
                            alt="Post"
                            className="h-full w-full object-contain"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#6a6a7a]">
                            No Image
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col lg:w-[40%]">
                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-[#3a3a4a] p-4">
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
                                alt=""
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        </Link>
                        <Link
                            to={`/profile/${post.user?._id}`}
                            className="font-semibold text-white hover:text-[#a855f7]"
                        >
                            {post.user?.name}
                        </Link>
                    </div>

                    {/* Comments */}
                    <div className="flex-1 space-y-4 overflow-y-auto p-4">
                        {/* Caption */}
                        {post.content && (
                            <div className="flex gap-3">
                                <Link
                                    to={`/profile/${post.user?._id}`}
                                    className="shrink-0"
                                >
                                    <img
                                        src={
                                            post.user?.avatar ||
                                            `https://ui-avatars.com/api/?name=${
                                                post.user?.name || "U"
                                            }&background=6366f1&color=fff`
                                        }
                                        alt=""
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                </Link>
                                <p className="text-sm text-[#b8b8c8]">
                                    <Link
                                        to={`/profile/${post.user?._id}`}
                                        className="mr-2 font-semibold text-white hover:text-[#a855f7]"
                                    >
                                        {post.user?.name}
                                    </Link>
                                    {post.content}
                                </p>
                            </div>
                        )}

                        {comments.map((c) => (
                            <div
                                key={c._id}
                                className="flex gap-3"
                            >
                                <Link
                                    to={`/profile/${c.user?._id}`}
                                    className="shrink-0"
                                >
                                    <img
                                        src={
                                            c.user?.avatar ||
                                            `https://ui-avatars.com/api/?name=${
                                                c.user?.name || "U"
                                            }&background=6366f1&color=fff`
                                        }
                                        alt=""
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                </Link>
                                <div>
                                    <p className="text-sm text-[#b8b8c8]">
                                        <Link
                                            to={`/profile/${c.user?._id}`}
                                            className="mr-2 font-semibold text-white hover:text-[#a855f7]"
                                        >
                                            {c.user?.name}
                                        </Link>
                                        {c.content}
                                    </p>
                                    <p className="mt-1 text-xs text-[#6a6a7a]">
                                        {formatDate(c.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="border-t border-[#3a3a4a]">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleLike}
                                    className="hover:opacity-70"
                                >
                                    {isLiked ? (
                                        <FaHeart className="h-6 w-6 text-pink-500" />
                                    ) : (
                                        <FaRegHeart className="h-6 w-6 text-[#b8b8c8]" />
                                    )}
                                </button>
                                <FaRegComment className="h-6 w-6 text-[#b8b8c8]" />
                                <FaShare className="h-5 w-5 text-[#b8b8c8]" />
                            </div>
                            <FaBookmark className="h-5 w-5 text-[#b8b8c8]" />
                        </div>

                        <div className="px-4 pb-2">
                            <p className="text-sm font-semibold text-white">
                                {likesCount.toLocaleString()} likes
                            </p>
                            <p className="mt-1 text-xs text-[#6a6a7a]">
                                {formatDate(post.createdAt)}
                            </p>
                        </div>

                        {user ? (
                            <form
                                onSubmit={handleCommentSubmit}
                                className="flex items-center border-t border-[#3a3a4a] p-4"
                            >
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) =>
                                        setNewComment(e.target.value)
                                    }
                                    placeholder="Add a comment..."
                                    className="flex-1 bg-transparent text-sm text-white placeholder-[#6a6a7a] focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!newComment.trim() || submitting}
                                    className="font-semibold text-[#a855f7] disabled:opacity-50"
                                >
                                    Post
                                </button>
                            </form>
                        ) : (
                            <div className="border-t border-[#3a3a4a] p-4 text-center">
                                <Link
                                    to="/login"
                                    className="text-sm text-[#a855f7]"
                                >
                                    Log in to comment
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
