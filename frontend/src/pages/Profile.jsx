import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { FaCog, FaThLarge, FaBookmark, FaCamera } from "react-icons/fa";
import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

export const Profile = () => {
    const { id } = useParams();
    const { user: currentUser, updateUser } = useAuth();
    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const avatarInputRef = useRef(null);

    const isOwnProfile = currentUser?._id === id;

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        try {
            if (isOwnProfile && currentUser) {
                setProfileUser(currentUser);
                setEditName(currentUser.name || "");
            }

            const postsRes = await api.get(API_ENDPOINTS.POSTS.LIST);
            const allPosts = postsRes.data.metadata || [];
            const userPosts = allPosts.filter((p) => p.user?._id === id);
            setPosts(userPosts);

            if (!isOwnProfile && userPosts.length > 0) {
                setProfileUser(userPosts[0].user);
            }
        } catch (error) {
            console.error("Failed to load", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            await api.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, {
                name: editName,
            });
            setProfileUser((prev) => ({ ...prev, name: editName }));
            if (updateUser) updateUser({ name: editName });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update", error);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const res = await api.put(
                API_ENDPOINTS.USERS.UPLOAD_AVATAR,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            const newAvatar = res.data.metadata.avatar;
            setProfileUser((prev) => ({ ...prev, avatar: newAvatar }));
            if (updateUser) updateUser({ avatar: newAvatar });
        } catch (error) {
            console.error("Failed to upload avatar", error);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    if (!profileUser) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-[#ef4444]">User not found</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 pb-24 md:pb-8">
            {/* Profile Header */}
            <header className="mb-10 flex flex-col items-center gap-8 md:flex-row md:items-start">
                {/* Avatar */}
                <div className="relative">
                    <div className="avatar-ring p-1">
                        <img
                            src={
                                profileUser.avatar ||
                                `https://ui-avatars.com/api/?name=${profileUser.name}&size=150&background=6366f1&color=fff`
                            }
                            alt={profileUser.name}
                            className="h-32 w-32 rounded-full object-cover md:h-40 md:w-40"
                        />
                    </div>
                    {isOwnProfile && (
                        <>
                            <input
                                type="file"
                                ref={avatarInputRef}
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                            <button
                                onClick={() => avatarInputRef.current?.click()}
                                className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                            >
                                <FaCamera className="h-4 w-4" />
                            </button>
                        </>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                    <div className="mb-4 flex flex-col items-center gap-4 md:flex-row">
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) =>
                                        setEditName(e.target.value)
                                    }
                                    className="input-field w-48"
                                />
                                <button
                                    onClick={handleUpdateProfile}
                                    className="btn-primary text-sm py-2"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="text-sm text-[#6a6a7a]"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-2xl font-semibold text-white">
                                    {profileUser.name}
                                </h1>
                                {isOwnProfile && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="btn-secondary text-sm"
                                        >
                                            Edit Profile
                                        </button>
                                        <button className="rounded-lg p-2 text-[#b8b8c8] hover:bg-[#2a2a38]">
                                            <FaCog className="h-5 w-5" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="mb-4 flex justify-center gap-10 md:justify-start">
                        <div className="text-center md:text-left">
                            <span className="font-bold text-white">
                                {posts.length}
                            </span>
                            <span className="ml-1 text-[#b8b8c8]">posts</span>
                        </div>
                        <div className="text-center md:text-left">
                            <span className="font-bold text-white">0</span>
                            <span className="ml-1 text-[#b8b8c8]">
                                followers
                            </span>
                        </div>
                        <div className="text-center md:text-left">
                            <span className="font-bold text-white">0</span>
                            <span className="ml-1 text-[#b8b8c8]">
                                following
                            </span>
                        </div>
                    </div>

                    <p className="font-semibold text-white">
                        {profileUser.name}
                    </p>
                    {profileUser.bio && (
                        <p className="text-[#b8b8c8]">{profileUser.bio}</p>
                    )}
                </div>
            </header>

            {/* Tabs */}
            <div className="mb-6 flex justify-center border-t border-[#3a3a4a]">
                <button className="flex items-center gap-2 border-t-2 border-[#a855f7] px-6 py-4 text-sm font-semibold uppercase tracking-wider text-white">
                    <FaThLarge /> Posts
                </button>
                <button className="flex items-center gap-2 border-t-2 border-transparent px-6 py-4 text-sm font-semibold uppercase tracking-wider text-[#6a6a7a]">
                    <FaBookmark /> Saved
                </button>
            </div>

            {/* Posts Grid */}
            {posts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1 md:gap-4">
                    {posts.map((post) => (
                        <Link
                            key={post._id}
                            to={`/post/${post._id}`}
                            className="group relative aspect-square overflow-hidden rounded-lg bg-[#1a1a24]"
                        >
                            {post.images && post.images.length > 0 ? (
                                <img
                                    src={post.images[0]}
                                    alt="Post"
                                    className="h-full w-full object-cover transition-all group-hover:scale-105 group-hover:opacity-80"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-[#6a6a7a]">
                                    No Image
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="py-16 text-center text-[#6a6a7a]">
                    <FaCamera className="mx-auto mb-4 h-12 w-12" />
                    <p className="text-xl font-semibold text-white">
                        No Posts Yet
                    </p>
                    {isOwnProfile && (
                        <Link
                            to="/create-post"
                            className="btn-primary mt-4 inline-block"
                        >
                            Share your first post
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};
