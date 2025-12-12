import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";
import { PostCard } from "../components/post/PostCard";
import EditProfileModal from "../components/profile/EditProfileModal";
import AvatarUploadModal from "../components/profile/AvatarUploadModal";
import {
    FaEdit,
    FaCamera,
    FaEnvelope,
    FaUser,
    FaBirthdayCake,
    FaCalendarAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser, updateUser } = useAuth();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [activeTab, setActiveTab] = useState("posts");
    const [loading, setLoading] = useState(true);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const avatarInputRef = useRef(null);

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

            // Sync with global auth state if viewing own profile
            if (currentUser && userRes.data.metadata._id === currentUser._id) {
                updateUser(userRes.data.metadata);
            }

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

    const handleUpdateProfile = async (updatedData) => {
        try {
            const response = await api.put(
                API_ENDPOINTS.USERS.UPDATE_PROFILE,
                updatedData
            );
            const updatedUser = response.data.metadata;
            setUser((prev) => ({ ...prev, ...updatedUser }));
            updateUser(updatedUser);

            // Update posts with new user details
            setPosts((prevPosts) =>
                prevPosts
                    ? prevPosts.map((post) => {
                          if (
                              post &&
                              post.user &&
                              post.user._id === updatedUser._id
                          ) {
                              return {
                                  ...post,
                                  user: {
                                      ...post.user,
                                      name: updatedUser.name || post.user.name,
                                      avatar:
                                          updatedUser.avatar ||
                                          post.user.avatar,
                                  },
                              };
                          }
                          return post;
                      })
                    : []
            );
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    const handleAvatarClick = () => {
        avatarInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener("load", () => {
            setSelectedImage(reader.result);
            setIsCropModalOpen(true);
        });
        reader.readAsDataURL(file);
    };

    const handleSaveAvatar = async (croppedImageBlob) => {
        setIsUploadingAvatar(true);
        const formData = new FormData();
        formData.append("avatar-image", croppedImageBlob, "avatar.jpg");

        try {
            const response = await api.put(
                API_ENDPOINTS.USERS.UPLOAD_AVATAR,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            const updatedUser = response.data.metadata;
            setUser((prev) => ({ ...prev, avatar: updatedUser.avatar }));
            updateUser(updatedUser);

            // Update posts with new avatar
            setPosts((prevPosts) =>
                prevPosts
                    ? prevPosts.map((post) => {
                          if (
                              post &&
                              post.user &&
                              post.user._id === updatedUser._id
                          ) {
                              return {
                                  ...post,
                                  user: {
                                      ...post.user,
                                      avatar: updatedUser.avatar,
                                  },
                              };
                          }
                          return post;
                      })
                    : []
            );
        } catch (error) {
            console.error("Failed to upload avatar", error);
            alert("Failed to upload avatar");
        } finally {
            setIsUploadingAvatar(false);
            setIsCropModalOpen(false);
            setSelectedImage(null);
            if (avatarInputRef.current) {
                avatarInputRef.current.value = "";
            }
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
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                currentUser={currentUser}
                onUpdate={handleUpdateProfile}
            />
            <AvatarUploadModal
                isOpen={isCropModalOpen}
                onClose={() => {
                    setIsCropModalOpen(false);
                    setSelectedImage(null);
                    if (avatarInputRef.current)
                        avatarInputRef.current.value = "";
                }}
                imageSrc={selectedImage}
                onUpload={handleSaveAvatar}
                isLoading={isUploadingAvatar}
            />
            <input
                type="file"
                ref={avatarInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
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
                                    {isUploadingAvatar && (
                                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
                                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                                        </div>
                                    )}
                                    {isOwnProfile && (
                                        <button
                                            onClick={handleAvatarClick}
                                            disabled={isUploadingAvatar}
                                            className="absolute bottom-2 right-2 rounded-full bg-[#1a1a24] p-2 text-white hover:bg-[#3f3f46] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
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
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="flex items-center gap-2 rounded-lg bg-[#3f3f46] px-4 py-2 font-semibold text-white hover:bg-[#52525b] transition-colors"
                                    >
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
                            {user.gender && (
                                <div className="flex items-center gap-3 text-gray-300">
                                    <FaUser className="text-[#6a6a7a] text-lg" />
                                    <span className="capitalize">
                                        {user.gender}
                                    </span>
                                </div>
                            )}
                            {user.birthday && (
                                <div className="flex items-center gap-3 text-gray-300">
                                    <FaBirthdayCake className="text-[#6a6a7a] text-lg" />
                                    <span>
                                        Born{" "}
                                        {new Date(
                                            user.birthday
                                        ).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            )}
                            {user.createdAt && (
                                <div className="flex items-center gap-3 text-gray-300">
                                    <FaCalendarAlt className="text-[#6a6a7a] text-lg" />
                                    <span>
                                        Joined{" "}
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString("en-US", {
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            )}
                            {isOwnProfile && (
                                <div className="flex items-center gap-3 text-gray-300">
                                    <FaEnvelope className="text-[#6a6a7a] text-lg" />
                                    <span>{user.email}</span>
                                </div>
                            )}
                        </div>
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
                            {photos.length === 0 &&
                                [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                                    <div
                                        key={i}
                                        className="aspect-square rounded-lg bg-[#2a2a38]/50"
                                    ></div>
                                ))}
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
