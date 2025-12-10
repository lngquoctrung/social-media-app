import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiSparkles } from "react-icons/hi";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="card-glass p-8">
                    {/* Logo */}
                    <div className="mb-8 flex flex-col items-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
                            <HiSparkles className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            Welcome back
                        </h1>
                        <p className="mt-1 text-[#6a6a7a]">
                            Sign in to continue to Vibe
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#b8b8c8]">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#b8b8c8]">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="input-field"
                            />
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="btn-primary w-full"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-[#6a6a7a]">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="font-semibold text-[#a855f7] hover:text-white"
                            >
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="mt-8 text-center text-xs text-[#6a6a7a]">
                    By signing in, you agree to our Terms and Privacy Policy
                </div>
            </div>
        </div>
    );
};
