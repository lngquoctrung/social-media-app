import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import { PostCard } from "../components/post/PostCard";
import {
    HiSparkles,
    HiTrendingUp,
    HiUserGroup,
    HiCalendar,
    HiPhotograph,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

export const Home = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get(API_ENDPOINTS.POSTS.LIST);
            setPosts(res.data.metadata || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePostDelete = (postId) => {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
    };

    if (loading)
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="loader"></div>
            </div>
        );

    return (
        <div className="min-h-screen bg-[#0f0f14] pt-6 text-white pb-20">
            <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-6 px-4 lg:grid-cols-[280px_1fr_300px]">
                {/* Left Sidebar - Navigation */}
                <aside className="hidden lg:block sticky top-24 h-fit">
                    <div className="space-y-6">
                        {user && (
                            <Link
                                to={`/profile/${user._id}`}
                                className="flex items-center gap-3 rounded-xl p-3 hover:bg-[#1a1a24] transition-colors"
                            >
                                <img
                                    src={
                                        user.avatar ||
                                        `https://ui-avatars.com/api/?name=${user.name}&background=random`
                                    }
                                    alt=""
                                    className="h-12 w-12 rounded-full object-cover border-2 border-[#1a1a24]"
                                />
                                <div>
                                    <p className="font-semibold text-white">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-[#a1a1aa]">
                                        @{user.email?.split("@")[0]}
                                    </p>
                                </div>
                            </Link>
                        )}

                        <nav className="space-y-1">
                            {[
                                {
                                    icon: HiSparkles,
                                    label: "News Feed",
                                    active: true,
                                },
                                { icon: HiTrendingUp, label: "Explore" },
                                { icon: HiUserGroup, label: "Friends" },
                                { icon: HiCalendar, label: "Events" },
                            ].map((item) => (
                                <button
                                    key={item.label}
                                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                                        item.active
                                            ? "bg-[#1a1a24] text-[#a855f7]"
                                            : "text-[#a1a1aa] hover:bg-[#1a1a24] hover:text-white"
                                    }`}
                                >
                                    <item.icon
                                        className={`h-5 w-5 ${
                                            item.active
                                                ? "text-[#a855f7]"
                                                : "text-[#71717a]"
                                        }`}
                                    />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </nav>

                        <div className="pt-4 border-t border-[#1a1a24] px-4">
                            <p className="text-xs text-[#52525b] leading-relaxed">
                                Privacy · Terms · Advertising · Cookies · Meta ©
                                2024
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Main Feed */}
                <main className="w-full max-w-[640px] mx-auto">
                    {/* Create Post Input */}
                    <div className="mb-6 rounded-xl bg-[#1a1a24] p-4 border border-[#2a2a38]">
                        <div className="flex gap-3">
                            <img
                                src={
                                    user?.avatar ||
                                    `https://ui-avatars.com/api/?name=${
                                        user?.name || "U"
                                    }&background=random`
                                }
                                alt=""
                                className="h-10 w-10 rounded-full object-cover"
                            />
                            <Link
                                to="/create-post"
                                className="flex-1 bg-[#2a2a38] hover:bg-[#3f3f46] text-[#6a6a7a] text-sm py-2.5 px-4 rounded-full transition-colors text-left flex items-center"
                            >
                                What's on your mind, {user?.name?.split(" ")[0]}
                                ?
                            </Link>
                        </div>
                    </div>

                    {/* Posts */}
                    <div className="space-y-6">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    onDelete={handlePostDelete}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-[#52525b]">
                                    No posts available
                                </p>
                            </div>
                        )}
                    </div>
                </main>

                {/* Right Sidebar - Widgets */}
                <aside className="hidden lg:block sticky top-24 h-fit space-y-6">
                    {/* Upcoming Events */}
                    <div className="rounded-xl bg-[#1a1a24] p-4 border border-[#2a2a38]">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-200">
                                Upcoming Events
                            </h3>
                            <button className="text-xs text-[#a855f7] hover:underline">
                                See all
                            </button>
                        </div>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3"
                                >
                                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#2a2a38] text-center border border-[#3f3f46]">
                                        <span className="text-xs font-bold text-white">
                                            1{i}
                                        </span>
                                        <span className="text-[10px] text-[#a1a1aa] uppercase">
                                            Dec
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-200">
                                            Creative Workshop
                                        </p>
                                        <p className="text-xs text-[#71717a]">
                                            10:00 AM - 12:00 PM
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Online Contacts */}
                    <div className="rounded-xl bg-[#1a1a24] p-4 border border-[#2a2a38]">
                        <h3 className="mb-4 text-sm font-bold text-gray-200">
                            Online Friends (Comming soon)
                        </h3>
                        <ul className="space-y-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <li
                                    key={i}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a2a38] cursor-pointer transition-colors"
                                >
                                    <div className="relative">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=User${i}&background=random`}
                                            alt=""
                                            className="h-8 w-8 rounded-full"
                                        />
                                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-[#1a1a24]"></span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-300">
                                        Friend Name {i}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};
