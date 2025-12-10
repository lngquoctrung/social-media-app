import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    FaHome,
    FaCompass,
    FaPlusCircle,
    FaUser,
    FaSignOutAlt,
    FaBell,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#3a3a4a] bg-[#0f0f14]/90 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                {/* Logo */}
                <NavLink
                    to="/"
                    className="flex items-center gap-2"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                        <HiSparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold gradient-text">
                        Vibe
                    </span>
                </NavLink>

                {/* Center Nav */}
                <div className="hidden items-center gap-1 md:flex">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                                isActive
                                    ? "bg-[#22222e] text-white"
                                    : "text-[#b8b8c8] hover:bg-[#1a1a24] hover:text-white"
                            }`
                        }
                    >
                        <FaHome className="h-4 w-4" />
                        <span>Feed</span>
                    </NavLink>
                    <NavLink
                        to="/explore"
                        className={({ isActive }) =>
                            `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                                isActive
                                    ? "bg-[#22222e] text-white"
                                    : "text-[#b8b8c8] hover:bg-[#1a1a24] hover:text-white"
                            }`
                        }
                    >
                        <FaCompass className="h-4 w-4" />
                        <span>Explore</span>
                    </NavLink>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <NavLink
                                to="/create-post"
                                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                            >
                                <FaPlusCircle className="h-4 w-4" />
                                <span className="hidden sm:inline">Create</span>
                            </NavLink>

                            <button className="relative rounded-xl p-2 text-[#b8b8c8] transition-colors hover:bg-[#1a1a24] hover:text-white">
                                <FaBell className="h-5 w-5" />
                                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-pink-500"></span>
                            </button>

                            <NavLink
                                to={`/profile/${user._id}`}
                                className="avatar-ring"
                            >
                                <img
                                    src={
                                        user.avatar ||
                                        `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`
                                    }
                                    alt={user.name}
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                            </NavLink>

                            <button
                                onClick={handleLogout}
                                className="rounded-xl p-2 text-[#b8b8c8] transition-colors hover:bg-[#1a1a24] hover:text-white"
                                title="Logout"
                            >
                                <FaSignOutAlt className="h-5 w-5" />
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <NavLink
                                to="/login"
                                className="rounded-xl px-4 py-2 text-sm font-medium text-[#b8b8c8] transition-colors hover:text-white"
                            >
                                Sign In
                            </NavLink>
                            <NavLink
                                to="/register"
                                className="btn-primary text-sm"
                            >
                                Get Started
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            <div className="fixed bottom-0 left-0 right-0 flex items-center justify-around border-t border-[#3a3a4a] bg-[#0f0f14]/95 py-2 backdrop-blur-xl md:hidden">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `p-3 ${isActive ? "text-white" : "text-[#6a6a7a]"}`
                    }
                >
                    <FaHome className="h-6 w-6" />
                </NavLink>
                <NavLink
                    to="/explore"
                    className={({ isActive }) =>
                        `p-3 ${isActive ? "text-white" : "text-[#6a6a7a]"}`
                    }
                >
                    <FaCompass className="h-6 w-6" />
                </NavLink>
                {user && (
                    <NavLink
                        to="/create-post"
                        className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-3 text-white"
                    >
                        <FaPlusCircle className="h-6 w-6" />
                    </NavLink>
                )}
                <NavLink
                    to={user ? `/profile/${user._id}` : "/login"}
                    className={({ isActive }) =>
                        `p-3 ${isActive ? "text-white" : "text-[#6a6a7a]"}`
                    }
                >
                    <FaUser className="h-6 w-6" />
                </NavLink>
            </div>
        </nav>
    );
};
