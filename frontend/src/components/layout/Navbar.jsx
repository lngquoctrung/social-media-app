import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaSignOutAlt, FaSearch, FaUser, FaCog } from "react-icons/fa";

export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuRef = useRef(null);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="sticky top-0 left-0 right-0 z-50 border-b border-[#3a3a4a] bg-[#1a1a24] shadow-sm">
            <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-4">
                {/* Logo */}
                <NavLink
                    to="/"
                    className="flex items-center gap-2"
                >
                    <span className="text-xl font-bold tracking-tight text-white">
                        Connection
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
                <div className="flex items-center gap-2 sm:gap-3">
                    {user ? (
                        <>

                            {/* Mobile Search Icon */}
                            <button className="md:hidden text-[#b8b8c8] hover:text-white p-2">
                                <FaSearch className="h-5 w-5" />
                            </button>


                            {/* User Avatar with Dropdown Popup */}
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setIsMenuOpen((prev) => !prev)}
                                    className="flex items-center gap-2 rounded-full border border-[#3a3a4a] bg-[#0f0f14] pl-1 pr-3 py-1 hover:border-[#6366f1] transition-colors focus:outline-none"
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
                                </button>

                                {/* Dropdown Menu Popup */}
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-60 rounded-xl border border-[#3a3a4a] bg-[#1a1a24] p-2 shadow-2xl z-50">
                                        <div className="flex items-center gap-3 p-2.5 border-b border-[#2a2a38]">
                                            <img
                                                src={
                                                    user.avatar ||
                                                    `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`
                                                }
                                                alt={user.name}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-semibold text-white truncate">
                                                    {user.name}
                                                </span>
                                                <span className="text-xs text-gray-400 truncate">
                                                    @{user.email?.split("@")[0] || "user"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-1.5 space-y-1">
                                            <button
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    navigate(`/profile/${user._id}`);
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#b8b8c8] hover:text-white hover:bg-[#2a2a38] rounded-lg transition-colors text-left"
                                            >
                                                <FaUser className="h-4 w-4 text-[#a855f7]" />
                                                <span>My Profile</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    navigate("/settings");
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#b8b8c8] hover:text-white hover:bg-[#2a2a38] rounded-lg transition-colors text-left"
                                            >
                                                <FaCog className="h-4 w-4 text-[#6366f1]" />
                                                <span>Settings</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    handleLogout();
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                                            >
                                                <FaSignOutAlt className="h-4 w-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <NavLink
                                to="/login"
                                className="text-sm font-semibold text-[#b8b8c8] hover:text-white px-3 py-1.5 rounded-full transition-colors"
                            >
                                Sign In
                            </NavLink>
                            <NavLink
                                to="/register"
                                className="hidden sm:inline-block rounded-full bg-white px-4 py-1.5 sm:px-5 sm:py-2 text-sm font-bold text-black hover:bg-gray-200 transition-colors"
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


