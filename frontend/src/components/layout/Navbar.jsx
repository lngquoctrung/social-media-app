import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaSignOutAlt, FaBell, FaSearch } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <nav className="sticky top-0 left-0 right-0 z-50 border-b border-[#3a3a4a] bg-[#1a1a24] shadow-sm">
            <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-4">
                {/* Logo */}
                <NavLink
                    to="/"
                    className="flex items-center gap-2"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-pink-500 shadow-lg shadow-indigo-500/20">
                        <HiSparkles className="h-6 w-6 text-white" />
                    </div>
                    <span className="hidden text-xl font-bold tracking-tight text-white md:block">
                        Connected
                    </span>
                </NavLink>

                {/* Search Bar - Centered */}
                <div className="mx-4 hidden max-w-md flex-1 md:block">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6a6a7a]" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full rounded-full bg-[#0f0f14] py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#6a6a7a] ring-1 ring-[#3a3a4a] focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            {/* Mobile Search Icon */}
                            <button className="md:hidden text-[#b8b8c8]">
                                <FaSearch className="h-5 w-5" />
                            </button>

                            <button className="relative rounded-full bg-[#2a2a38] p-2.5 text-[#b8b8c8] hover:bg-[#3f3f46] hover:text-white transition-colors">
                                <FaBell className="h-5 w-5" />
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#1a1a24]"></span>
                            </button>

                            <NavLink
                                to={`/profile/${user._id}`}
                                className="flex items-center gap-2 rounded-full border border-[#3a3a4a] bg-[#0f0f14] pl-1 pr-3 py-1 hover:border-[#6366f1] transition-colors"
                            >
                                <img
                                    src={
                                        user.avatar ||
                                        `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`
                                    }
                                    alt={user.name}
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                                <span className="hidden text-sm font-medium text-white sm:block">
                                    {user.name.split(" ")[0]}
                                </span>
                            </NavLink>

                            <button
                                onClick={handleLogout}
                                className="rounded-full p-2 text-[#b8b8c8] hover:bg-[#3f3f46] hover:text-white transition-colors"
                                title="Logout"
                            >
                                <FaSignOutAlt className="h-5 w-5" />
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <NavLink
                                to="/login"
                                className="text-sm font-semibold text-[#b8b8c8] hover:text-white"
                            >
                                Sign In
                            </NavLink>
                            <NavLink
                                to="/register"
                                className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black hover:bg-gray-200 transition-colors"
                            >
                                Get Started
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
