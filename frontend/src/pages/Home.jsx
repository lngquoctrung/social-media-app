import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import { PostCard } from "../components/post/PostCard";
import { HiSparkles, HiTrendingUp } from "react-icons/hi";
import { FaFire } from "react-icons/fa";

export const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get(API_ENDPOINTS.POSTS.LIST);
            setPosts(res.data.metadata || []);
        } catch (err) {
            console.error("Failed to fetch posts", err);
            setError("Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <p className="text-[#ef4444]">{error}</p>
                <button
                    onClick={fetchPosts}
                    className="btn-primary"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-6 pb-24 md:pb-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                {/* Main Feed */}
                <div className="space-y-6">
                    {/* Welcome Header */}
                    <div className="card-glass p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                                <HiSparkles className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">
                                    Your Feed
                                </h1>
                                <p className="text-sm text-[#6a6a7a]">
                                    Discover what's happening
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Posts Grid */}
                    {posts.length === 0 ? (
                        <div className="card-glass flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#22222e]">
                                <HiSparkles className="h-8 w-8 text-[#6a6a7a]" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">
                                No posts yet
                            </h2>
                            <p className="mt-2 text-[#6a6a7a]">
                                Be the first to share something amazing!
                            </p>
                            <Link
                                to="/create-post"
                                className="btn-primary mt-6"
                            >
                                Create Post
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                            {posts.map((post) => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <aside className="hidden lg:block">
                    <div className="sticky top-20 space-y-6">
                        {/* Trending */}
                        <div className="card p-4">
                            <div className="mb-4 flex items-center gap-2 text-white">
                                <FaFire className="h-5 w-5 text-orange-500" />
                                <h3 className="font-semibold">Trending</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    "Photography",
                                    "Travel",
                                    "Food",
                                    "Tech",
                                    "Art",
                                ].map((topic, i) => (
                                    <div
                                        key={topic}
                                        className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-[#2a2a38]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-[#6a6a7a]">
                                                {i + 1}
                                            </span>
                                            <span className="text-sm font-medium text-white">
                                                #{topic}
                                            </span>
                                        </div>
                                        <span className="text-xs text-[#6a6a7a]">
                                            {Math.floor(Math.random() * 1000) +
                                                100}{" "}
                                            posts
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Suggestions */}
                        <div className="card p-4">
                            <div className="mb-4 flex items-center gap-2 text-white">
                                <HiTrendingUp className="h-5 w-5 text-purple-400" />
                                <h3 className="font-semibold">
                                    Suggested for you
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="avatar-ring">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=User${i}&background=6366f1&color=fff`}
                                                alt=""
                                                className="h-10 w-10 rounded-full"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm font-semibold text-white">
                                                User {i}
                                            </p>
                                            <p className="text-xs text-[#6a6a7a]">
                                                Suggested for you
                                            </p>
                                        </div>
                                        <button className="text-xs font-semibold text-[#a855f7] hover:text-white">
                                            Follow
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center text-xs text-[#6a6a7a]">
                            <p>© 2024 Vibe. Made with 💜</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};
