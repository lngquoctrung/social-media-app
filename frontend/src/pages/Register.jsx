import { useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiSparkles, HiCamera, HiUpload, HiX } from "react-icons/hi";
import Cropper from "react-easy-crop";
import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";

// Helper function to create image from url
const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.src = url;
    });

// Helper function to get cropped img
async function getCroppedImg(imageSrc, pixelCrop) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, "image/jpeg");
    });
}

export const Register = () => {
    const [step, setStep] = useState(1); // 1: Info, 2: Avatar
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birthday, setBirthday] = useState("");
    const [gender, setGender] = useState("male");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Avatar state
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const { register, updateUser } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl);
        }
    };

    const readFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => resolve(reader.result));
            reader.readAsDataURL(file);
        });
    };

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await register(name, email, password, birthday, gender);
            setStep(2); // Move to avatar step
        } catch (err) {
            setError(err.response?.data?.message || "Failed to register");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarSubmit = async () => {
        if (!imageSrc) {
            navigate("/"); // Skip if no image
            return;
        }

        setLoading(true);
        try {
            const croppedImageBlob = await getCroppedImg(
                imageSrc,
                croppedAreaPixels
            );
            const formData = new FormData();
            formData.append("avatar", croppedImageBlob, "avatar.jpg");

            const res = await api.put(
                API_ENDPOINTS.USERS.UPLOAD_AVATAR,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            // Update user in context with new avatar
            updateUser({ avatar: res.data.metadata.avatar });
            navigate("/");
        } catch (err) {
            console.error(err);
            setError(
                "Failed to upload avatar, but registration was successful."
            );
            setTimeout(() => navigate("/"), 2000); // Navigate anyway
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="card-glass p-8">
                    {/* Header */}
                    <div className="mb-8 flex flex-col items-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
                            <HiSparkles className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            {step === 1 ? "Join Vibe" : "Add a photo"}
                        </h1>
                        <p className="mt-1 text-center text-[#6a6a7a]">
                            {step === 1
                                ? "Create your account and start sharing"
                                : "Show off your style with a profile picture"}
                        </p>
                    </div>

                    {step === 1 ? (
                        /* Step 1: Registration Form */
                        <form
                            onSubmit={handleInfoSubmit}
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-[#b8b8c8]">
                                        Birthday
                                    </label>
                                    <input
                                        type="date"
                                        value={birthday}
                                        onChange={(e) =>
                                            setBirthday(e.target.value)
                                        }
                                        required
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-[#b8b8c8]">
                                        Gender
                                    </label>
                                    <select
                                        value={gender}
                                        onChange={(e) =>
                                            setGender(e.target.value)
                                        }
                                        className="input-field appearance-none"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#b8b8c8]">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
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
                                disabled={
                                    loading ||
                                    !email ||
                                    !password ||
                                    !name ||
                                    !birthday
                                }
                                className="btn-primary w-full"
                            >
                                {loading ? "Creating account..." : "Continue"}
                            </button>

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
                        </form>
                    ) : (
                        /* Step 2: Avatar Upload */
                        <div className="space-y-6">
                            {!imageSrc ? (
                                <div
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#3a3a4a] bg-[#1a1a24] hover:bg-[#22222e] hover:border-[#a855f7] transition-all"
                                >
                                    <div className="mb-4 rounded-full bg-[#2a2a38] p-4 text-[#a855f7]">
                                        <HiUpload className="h-8 w-8" />
                                    </div>
                                    <p className="font-medium text-white">
                                        Click to upload photo
                                    </p>
                                    <p className="text-sm text-[#6a6a7a]">
                                        JPG or PNG, max 5MB
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="relative h-64 w-full overflow-hidden rounded-xl border border-[#3a3a4a]">
                                        <Cropper
                                            image={imageSrc}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={1}
                                            onCropChange={setCrop}
                                            onCropComplete={onCropComplete}
                                            onZoomChange={setZoom}
                                            cropShape="round"
                                            showGrid={false}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="range"
                                            value={zoom}
                                            min={1}
                                            max={3}
                                            step={0.1}
                                            aria-labelledby="Zoom"
                                            onChange={(e) =>
                                                setZoom(e.target.value)
                                            }
                                            className="w-full h-2 bg-[#2a2a38] rounded-lg appearance-none cursor-pointer accent-[#a855f7]"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setImageSrc(null)}
                                        className="w-full text-sm text-[#ef4444] hover:underline"
                                    >
                                        Remove photo
                                    </button>
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {error && (
                                <div className="rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-400">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate("/")}
                                    className="flex-1 rounded-lg bg-[#2a2a38] px-4 py-2 font-semibold text-white hover:bg-[#3f3f46] transition-colors"
                                >
                                    Skip
                                </button>
                                <button
                                    onClick={handleAvatarSubmit}
                                    disabled={!imageSrc || loading}
                                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Uploading..." : "Finish"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
