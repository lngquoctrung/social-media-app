import { useTheme } from "../context/ThemeContext";
import {
    FaMoon,
    FaLock,
    FaBell,
    FaShieldAlt,
    FaGlobe,
} from "react-icons/fa";

export const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className="min-h-screen bg-[#0f0f14] pt-6 pb-24 text-white">
            <div className="mx-auto max-w-4xl px-4">
                {/* Header */}
                <div className="mb-8 border-b border-[#2a2a38] pb-4">
                    <h1 className="text-2xl font-bold text-white sm:text-3xl">
                        Settings
                    </h1>
                    <p className="mt-1 text-sm text-[#a1a1aa]">
                        Manage your account preferences and application settings.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Appearance Section */}
                    <div className="rounded-xl border border-[#2a2a38] bg-[#1a1a24] p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-lg bg-[#a855f7]/10 p-2.5 text-[#a855f7]">
                                <FaMoon className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-white">
                                    Appearance
                                </h2>
                                <p className="text-xs text-[#a1a1aa]">
                                    Customize how Connection looks on your device.
                                </p>
                            </div>
                        </div>

                        <div className="divide-y divide-[#2a2a38]">
                            {/* Dark Mode Option */}
                            <div className="flex items-center justify-between py-3.5">
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        Dark Mode
                                    </p>
                                    <p className="text-xs text-[#71717a]">
                                        Use dark theme for a comfortable night experience.
                                    </p>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    aria-label="Toggle Dark Mode"
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                                        isDark ? "bg-[#a855f7]" : "bg-gray-400"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            isDark ? "translate-x-6" : "translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>


                            {/* Compact View Option */}
                            <div className="flex items-center justify-between py-3.5">
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        Compact View
                                    </p>
                                    <p className="text-xs text-[#71717a]">
                                        Display more posts with reduced spacing.
                                    </p>
                                </div>
                                <span className="rounded-full bg-[#2a2a38] px-2.5 py-1 text-xs font-semibold text-[#a855f7]">
                                    Coming soon
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Privacy & Safety Section */}
                    <div className="rounded-xl border border-[#2a2a38] bg-[#1a1a24] p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-lg bg-[#6366f1]/10 p-2.5 text-[#6366f1]">
                                <FaLock className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-white">
                                    Privacy & Safety
                                </h2>
                                <p className="text-xs text-[#a1a1aa]">
                                    Control who sees your profile and content.
                                </p>
                            </div>
                        </div>

                        <div className="divide-y divide-[#2a2a38]">
                            <div className="flex items-center justify-between py-3.5">
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        Private Account
                                    </p>
                                    <p className="text-xs text-[#71717a]">
                                        Only approved followers can view your posts.
                                    </p>
                                </div>
                                <span className="rounded-full bg-[#2a2a38] px-2.5 py-1 text-xs font-semibold text-[#a855f7]">
                                    Coming soon
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-3.5">
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        Blocked Accounts
                                    </p>
                                    <p className="text-xs text-[#71717a]">
                                        Manage users you have blocked.
                                    </p>
                                </div>
                                <span className="rounded-full bg-[#2a2a38] px-2.5 py-1 text-xs font-semibold text-[#a855f7]">
                                    Coming soon
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="rounded-xl border border-[#2a2a38] bg-[#1a1a24] p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-400">
                                <FaBell className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-white">
                                    Notifications
                                </h2>
                                <p className="text-xs text-[#a1a1aa]">
                                    Manage your alert and email preferences.
                                </p>
                            </div>
                        </div>

                        <div className="divide-y divide-[#2a2a38]">
                            <div className="flex items-center justify-between py-3.5">
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        Push Notifications
                                    </p>
                                    <p className="text-xs text-[#71717a]">
                                        Receive instant alerts for comments and likes.
                                    </p>
                                </div>
                                <span className="rounded-full bg-[#2a2a38] px-2.5 py-1 text-xs font-semibold text-[#a855f7]">
                                    Coming soon
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-3.5">
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        Email Digests
                                    </p>
                                    <p className="text-xs text-[#71717a]">
                                        Get weekly summaries of popular posts.
                                    </p>
                                </div>
                                <span className="rounded-full bg-[#2a2a38] px-2.5 py-1 text-xs font-semibold text-[#a855f7]">
                                    Coming soon
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Account Security */}
                    <div className="rounded-xl border border-[#2a2a38] bg-[#1a1a24] p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-400">
                                <FaShieldAlt className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-white">
                                    Account & Security
                                </h2>
                                <p className="text-xs text-[#a1a1aa]">
                                    Protect your account and password.
                                </p>
                            </div>
                        </div>

                        <div className="divide-y divide-[#2a2a38]">
                            <div className="flex items-center justify-between py-3.5">
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        Change Password
                                    </p>
                                    <p className="text-xs text-[#71717a]">
                                        Update your password periodically for safety.
                                    </p>
                                </div>
                                <span className="rounded-full bg-[#2a2a38] px-2.5 py-1 text-xs font-semibold text-[#a855f7]">
                                    Coming soon
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-3.5">
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        Two-Factor Authentication (2FA)
                                    </p>
                                    <p className="text-xs text-[#71717a]">
                                        Add an extra layer of security to your account.
                                    </p>
                                </div>
                                <span className="rounded-full bg-[#2a2a38] px-2.5 py-1 text-xs font-semibold text-[#a855f7]">
                                    Coming soon
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Language & Region */}
                    <div className="rounded-xl border border-[#2a2a38] bg-[#1a1a24] p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-lg bg-sky-500/10 p-2.5 text-sky-400">
                                <FaGlobe className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-white">
                                    Language & Region
                                </h2>
                                <p className="text-xs text-[#a1a1aa]">
                                    Select your primary language and regional formatting.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-3.5">
                            <div>
                                <p className="text-sm font-medium text-white">
                                    Language
                                </p>
                                <p className="text-xs text-[#71717a]">
                                    Currently set to English (US).
                                </p>
                            </div>
                            <span className="rounded-full bg-[#2a2a38] px-2.5 py-1 text-xs font-semibold text-[#a855f7]">
                                Coming soon
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
