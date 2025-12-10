import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import { PostCard } from "../components/post/PostCard";
import {
    FaMapMarkerAlt,
    FaBriefcase,
    FaGraduationCap,
    FaEdit,
    FaCamera,
    FaEnvelope,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [activeTab, setActiveTab] = useState("posts");
    const [loading, setLoading] = useState(true);

    const isOwnProfile = currentUser?._id === id;

    useEffect(() => {
        fetchProfileData();
    }, [id]);

    const fetchProfileData = async () => {
        try {
            const [userRes, postsRes] = await Promise.all([
                api.get(API_ENDPOINTS.USERS.GET_ONE(id)),
                api.get(`${API_ENDPOINTS.POSTS.LIST}?userId=${id}`),
            ]);
            setUser(userRes.data.metadata);

            const fetchedPosts = postsRes.data.metadata || [];
            setPosts(fetchedPosts);

            // Extract images from posts
            const allImages = fetchedPosts.reduce((acc, post) => {
                if (post.images && post.images.length > 0) {
                    return [...acc, ...post.images];
                }
                return acc;
            }, []);
            setPhotos(allImages);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    if (!user)
        return <div className="text-center p-8 text-white">User not found</div>;

    return (
        <div className="min-h-screen bg-[#0f0f14] pb-20">
            {/* Header Section */}
            <div className="bg-[#1a1a24] shadow-md mb-6">
                <div className="mx-auto max-w-5xl">
                    {/* Cover Photo */}
                    <div className="relative h-[250px] w-full bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-b-xl">
                        {isOwnProfile && (
                            <button className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-black/40 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-md hover:bg-black/60 transition-all">
                                <FaCamera /> Edit Cover
                            </button>
                        )}
                    </div>

                    {/* Profile Info Bar */}
                    <div className="px-4 pb-4">
                        <div className="relative flex flex-col md:flex-row md:items-end md:gap-6">
                            {/* Avatar */}
                            <div className="-mt-12 mb-4 flex justify-center md:mb-0 md:justify-start">
                                <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-[#1a1a24] bg-[#22222e]">
                                    <img
                                        src={
                                            user.avatar ||
                                            `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`
                                        }
                                        alt={user.name}
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                    {isOwnProfile && (
                                        <button className="absolute bottom-2 right-2 rounded-full bg-[#1a1a24] p-2 text-white hover:bg-[#3f3f46]">
                                            <FaCamera className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Name & Basic Info */}
                            <div className="flex-1 text-center md:mb-4 md:text-left">
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    {user.name}
                                </h1>
                                <p className="text-gray-400 font-medium">
                                    @
                                    {user.email?.split("@")[0] ||
                                        user.name
                                            .toLowerCase()
                                            .replace(/\s/g, "")}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-center gap-3 mb-4 md:mb-6">
                                {isOwnProfile ? (
                                    <button className="flex items-center gap-2 rounded-lg bg-[#3f3f46] px-4 py-2 font-semibold text-white hover:bg-[#52525b] transition-colors">
                                        <FaEdit /> Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() =>
                                                currentUser
                                                    ? null
                                                    : navigate("/login")
                                            }
                                            className="rounded-lg bg-[#6366f1] px-6 py-2 font-semibold text-white hover:bg-[#4f46e5] transition-colors"
                                        >
                                            Follow
                                        </button>
                                        <button
                                            onClick={() =>
                                                currentUser
                                                    ? null
                                                    : navigate("/login")
                                            }
                                            className="rounded-lg bg-[#3f3f46] px-4 py-2 font-semibold text-white hover:bg-[#52525b] transition-colors"
                                        >
                                            Message
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="mt-2 h-px w-full bg-[#3a3a4a]"></div>

                        {/* Tabs */}
                        <div className="flex justify-center gap-8 md:justify-start pt-1">
                            {["Posts", "About", "Friends", "Photos"].map(
                                (tab) => (
                                    <button
                                        key={tab}
                                        onClick={() =>
                                            setActiveTab(tab.toLowerCase())
                                        }
                                        className={`py-3 text-sm font-semibold border-b-2 transition-colors ${
                                            activeTab === tab.toLowerCase()
                                                ? "border-[#a855f7] text-[#a855f7]"
                                                : "border-transparent text-[#b8b8c8] hover:text-white"
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section - 3 Column Layout for larger screens to match Home */}
            <div className="mx-auto max-w-5xl px-4 grid grid-cols-1 md:grid-cols-[340px_1fr] gap-6">
                {/* Left Sidebar: About & Photos */}
                <div className="space-y-6">
                    {/* Intro Card */}
                    <div className="bg-[#1a1a24] rounded-xl p-4 border border-[#2a2a38]">
                        <h2 className="text-lg font-bold text-white mb-4">
                            Intro
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3 text-gray-300">
                                <FaBriefcase className="text-[#6a6a7a] text-lg" />
                                <span>
                                    Works at <strong>Freelancer</strong>
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <FaGraduationCap className="text-[#6a6a7a] text-lg" />
                                <span>
                                    Studied at{" "}
                                    <strong>University of Design</strong>
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <FaMapMarkerAlt className="text-[#6a6a7a] text-lg" />
                                <span>
                                    From <strong>Ho Chi Minh City</strong>
                                </span>
                            </div>
                            {isOwnProfile && (
                                <div className="flex items-center gap-3 text-gray-300">
                                    <FaEnvelope className="text-[#6a6a7a] text-lg" />
                                    <span>{user.email}</span>
                                </div>
                            )}
                        </div>
                        {isOwnProfile && (
                            <button className="mt-4 w-full rounded-lg bg-[#2a2a38] py-2 text-sm font-medium text-white hover:bg-[#3f3f46] transition-colors">
                                Edit Details
                            </button>
                        )}
                    </div>

                    {/* Photos Card */}
                    <div className="bg-[#1a1a24] rounded-xl p-4 border border-[#2a2a38]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-white">
                                Photos
                            </h2>
                            <button className="text-sm text-[#a855f7] hover:underline">
                                See all
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {photos.slice(0, 9).map((img, i) => (
                                <div
                                    key={i}
                                    className="aspect-square overflow-hidden rounded-lg bg-[#2a2a38]"
                                >
                                    <img
                                        src={img}
                                        alt=""
                                        className="h-full w-full object-cover hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                            ))}
                            {photos.length === 0 && (
                                <div className="col-span-3 text-center py-4 text-xs text-[#6a6a7a]">
                                    No photos to show
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Feed */}
                <div className="space-y-6">
                    {/* Create Post Widget */}
                    {isOwnProfile ? (
                        <div className="bg-[#1a1a24] rounded-xl p-4 border border-[#2a2a38]">
                            <div className="flex gap-3">
                                <img
                                    src={
                                        currentUser?.avatar ||
                                        `https://ui-avatars.com/api/?name=${currentUser?.name}&background=random`
                                    }
                                    alt=""
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                                <Link
                                    to="/create-post"
                                    className="flex-1 bg-[#2a2a38] hover:bg-[#3f3f46] text-[#6a6a7a] text-sm py-2.5 px-4 rounded-full transition-colors text-left flex items-center"
                                >
                                    What's on your mind?
                                </Link>
                            </div>
                        </div>
                    ) : null}

                    {/* Posts Feed */}
                    {posts.length === 0 ? (
                        <div className="bg-[#1a1a24] rounded-xl p-8 text-center border border-[#2a2a38]">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2a2a38] mb-4">
                                <FaCamera className="text-2xl text-[#6a6a7a]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                No posts yet
                            </h3>
                            <p className="text-[#6a6a7a]">
                                {isOwnProfile
                                    ? "Share your first moment!"
                                    : "This user hasn't posted anything yet."}
                            </p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
