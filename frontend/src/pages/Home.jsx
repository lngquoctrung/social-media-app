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
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

export const Home = () => {
    const { user, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState("News Feed");
    const [posts, setPosts] = useState(() => {
        // Initialize from session storage if available
        const savedPosts = sessionStorage.getItem("homePosts");
        return savedPosts ? JSON.parse(savedPosts) : [];
    });
    const [loading, setLoading] = useState(() => {
        // If we have posts, we are not initially loading (we show cached content first)
        return !sessionStorage.getItem("homePosts");
    });

    useEffect(() => {
        // Prevent browser from restoring scroll automatically
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        if (!authLoading) {
            fetchPosts();
        }

        // Save scroll position throttled
        let timeoutId;
        const handleScroll = () => {
            if (timeoutId) return;
            timeoutId = setTimeout(() => {
                if (activeTab === "News Feed") {
                    sessionStorage.setItem(
                        "homeScrollY",
                        window.scrollY.toString()
                    );
                }
                timeoutId = null;
            }, 100);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [activeTab, authLoading]);

    // Save posts to session storage whenever they revert/update
    useEffect(() => {
        if (posts.length > 0) {
            sessionStorage.setItem("homePosts", JSON.stringify(posts));
        }
    }, [posts]);

    // Restore scroll when component mounts (or when cached posts are rendered)
    useEffect(() => {
        const savedScrollY = sessionStorage.getItem("homeScrollY");

        if (savedScrollY && posts.length > 0 && activeTab === "News Feed") {
            const targetY = parseInt(savedScrollY);

            // Check immediately
            window.scrollTo(0, targetY);

            // Continue attempting to restore scroll for dynamic content (images)
            let attempts = 0;
            const maxAttempts = 50; // Try for ~2.5 seconds (50 * 50ms)

            const intervalId = setInterval(() => {
                if (Math.abs(window.scrollY - targetY) < 10) {
                    clearInterval(intervalId);
                    return;
                }

                window.scrollTo(0, targetY);

                attempts++;
                if (attempts >= maxAttempts) {
                    clearInterval(intervalId);
                }
            }, 50);

            return () => clearInterval(intervalId);
        }
    }, [posts, activeTab]);

    const fetchPosts = async () => {
        try {
            const res = await api.get(API_ENDPOINTS.POSTS.LIST);
            const newPosts = res.data.metadata || [];

            setPosts(newPosts);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePostDelete = (postId) => {
        setPosts((prev) => {
            const newPosts = prev.filter((p) => p._id !== postId);
            sessionStorage.setItem("homePosts", JSON.stringify(newPosts));
            return newPosts;
        });
    };

    const handleNavClick = (label) => {
        if (label === "News Feed") {
            if (activeTab === "News Feed") {
                // Already on News Feed -> Refresh
                sessionStorage.removeItem("homeScrollY");
                window.scrollTo({ top: 0, behavior: "smooth" });
                setLoading(true);
                fetchPosts();
            } else {
                // Switching back to News Feed -> Restore scroll (handled by useEffect)
                setActiveTab(label);
            }
        } else {
            // Switching to another tab - Save scroll if currently on News Feed
            if (activeTab === "News Feed") {
                sessionStorage.setItem(
                    "homeScrollY",
                    window.scrollY.toString()
                );
            }
            setActiveTab(label);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const navItems = [
        {
            icon: HiSparkles,
            label: "News Feed",
        },
        { icon: HiTrendingUp, label: "Explore" },
        { icon: HiUserGroup, label: "Friends" },
        { icon: HiCalendar, label: "Events" },
    ];

    return (
        <div className="min-h-screen bg-[#0f0f14] pt-6 text-white pb-24 lg:pb-20">
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
                            {navItems.map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => handleNavClick(item.label)}
                                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                                        activeTab === item.label
                                            ? "bg-[#1a1a24] text-[#a855f7]"
                                            : "text-[#a1a1aa] hover:bg-[#1a1a24] hover:text-white"
                                    }`}
                                >
                                    <item.icon
                                        className={`h-5 w-5 ${
                                            activeTab === item.label
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
                    {activeTab === "News Feed" ? (
                        <>
                            {/* Create Post Input */}
                            <div className="mb-6 rounded-xl bg-[#1a1a24] p-3 md:p-4 border border-[#2a2a38]">
                                <div className="flex gap-3">
                                    <img
                                        src={
                                            user?.avatar ||
                                            `https://ui-avatars.com/api/?name=${
                                                user?.name || "U"
                                            }&background=random`
                                        }
                                        alt=""
                                        className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover"
                                    />
                                    <Link
                                        to="/create-post"
                                        className="flex-1 bg-[#2a2a38] hover:bg-[#3f3f46] text-[#6a6a7a] text-sm py-2 px-3 md:py-2.5 md:px-4 rounded-full transition-colors text-left flex items-center"
                                    >
                                        What's on your mind,{" "}
                                        {user?.name?.split(" ")[0]}?
                                    </Link>
                                </div>
                            </div>

                            {/* Posts */}
                            {loading ? (
                                <div className="flex h-40 items-center justify-center">
                                    <div className="loader"></div>
                                </div>
                            ) : (
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
                            )}
                        </>
                    ) : (
                        <div className="flex h-[50vh] flex-col items-center justify-center rounded-xl bg-[#1a1a24] border border-[#2a2a38] text-center p-8">
                            <div className="mb-4 rounded-full bg-[#2a2a38] p-4">
                                {navItems
                                    .find((item) => item.label === activeTab)
                                    ?.icon({
                                        className: "h-8 w-8 text-[#a855f7]",
                                    })}
                            </div>
                            <h2 className="mb-2 text-xl font-bold text-white">
                                {activeTab}
                            </h2>
                            <p className="text-[#a1a1aa]">
                                This feature is currently under development.
                                <br />
                                Stay tuned for updates!
                            </p>
                        </div>
                    )}
                </main>

                {/* Right Sidebar - Widgets */}
                <aside className="hidden lg:block sticky top-24 h-fit space-y-6">
                    {/* Upcoming Events */}
                    <div className="rounded-xl bg-[#1a1a24] p-4 border border-[#2a2a38]">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-200">
                                Upcoming Events (Comming soon)
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

            {/* Mobile Bottom Navigation */}
            {/* Mobile Bottom Navigation - Compact */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#2a2a38] bg-[#1a1a24] pb-safe lg:hidden">
                <div className="flex justify-around items-center px-2 py-2">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => handleNavClick(item.label)}
                            className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${
                                activeTab === item.label
                                    ? "text-[#a855f7]"
                                    : "text-[#71717a] hover:text-white"
                            }`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="text-[10px] font-medium">
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
};
