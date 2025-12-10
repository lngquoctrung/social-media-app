import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiSparkles } from "react-icons/hi";

export const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await register(name, email, password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to register");
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
                            Join Vibe
                        </h1>
                        <p className="mt-1 text-center text-[#6a6a7a]">
                            Create your account and start sharing
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        <div>
                            <label className="mb-2 block text-sm font-medium text-[#b8b8c8]">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                                className="input-field"
                            />
                        </div>
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
                                placeholder="Min. 6 characters"
                                required
                                minLength={6}
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
                            disabled={loading || !email || !password || !name}
                            className="btn-primary w-full"
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-[#6a6a7a]">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-[#a855f7] hover:text-white"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
