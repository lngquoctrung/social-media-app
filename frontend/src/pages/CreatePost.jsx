import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaImage, FaTimes, FaArrowLeft } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import { ImageCropper } from "../components/post/ImageCropper";
import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";

export const CreatePost = () => {
    const [step, setStep] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [croppedImageBlob, setCroppedImageBlob] = useState(null);
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState("");
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="card-glass p-8 text-center">
                    <p className="text-white">
                        Please log in to create a post.
                    </p>
                    <button
                        onClick={() => navigate("/login")}
                        className="btn-primary mt-4"
                    >
                        Log In
                    </button>
                </div>
            </div>
        );
    }

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setSelectedImage(reader.result);
                setStep(2);
            });
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (blob) => {
        setCroppedImageBlob(blob);
        setCroppedImageUrl(URL.createObjectURL(blob));
        setStep(3);
    };

    const handleBack = () => {
        if (step === 2) {
            setSelectedImage(null);
            setStep(1);
        } else if (step === 3) {
            setStep(2);
        }
    };

    const handleSubmit = async () => {
        if (!croppedImageBlob) return;

        setLoading(true);
        setProgress("Uploading image...");

        try {
            const formData = new FormData();
            formData.append("images", croppedImageBlob, "post.jpg");

            const uploadRes = await api.post(
                API_ENDPOINTS.POSTS.UPLOAD,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            setProgress("Creating post...");

            await api.post(API_ENDPOINTS.POSTS.CREATE, {
                content: caption,
                images: uploadRes.data.metadata,
            });

            navigate("/");
        } catch (error) {
            console.error("Failed to create post", error);
            alert("Failed to create post");
        } finally {
            setLoading(false);
            setProgress("");
        }
    };

    return (
        <div className="mx-auto max-w-2xl px-4 py-8 pb-24 md:pb-8">
            <div className="card-glass overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#3a3a4a] px-4 py-3">
                    {step > 1 ? (
                        <button
                            onClick={handleBack}
                            className="text-[#b8b8c8] hover:text-white"
                        >
                            <FaArrowLeft className="h-5 w-5" />
                        </button>
                    ) : (
                        <div className="w-5"></div>
                    )}
                    <h2 className="font-semibold text-white">
                        {step === 1
                            ? "New Post"
                            : step === 2
                            ? "Crop Image"
                            : "Add Details"}
                    </h2>
                    {step === 3 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="font-semibold text-[#a855f7] hover:text-white disabled:opacity-50"
                        >
                            {loading ? "Posting..." : "Share"}
                        </button>
                    ) : (
                        <div className="w-5"></div>
                    )}
                </div>

                {/* Step 1: Select */}
                {step === 1 && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                            <FaImage className="h-10 w-10 text-[#6a6a7a]" />
                        </div>
                        <p className="mb-2 text-xl font-semibold text-white">
                            Share your moment
                        </p>
                        <p className="mb-8 text-[#6a6a7a]">
                            Select a photo to get started
                        </p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="btn-primary"
                        >
                            Select Photo
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>
                )}

                {/* Step 2: Crop */}
                {step === 2 && selectedImage && (
                    <ImageCropper
                        image={selectedImage}
                        onCropComplete={handleCropComplete}
                        onCancel={handleBack}
                    />
                )}

                {/* Step 3: Caption */}
                {step === 3 && croppedImageUrl && (
                    <div className="md:flex">
                        <div className="relative aspect-square w-full bg-[#1a1a24] md:w-1/2">
                            <img
                                src={croppedImageUrl}
                                alt="Preview"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                            <div className="mb-4 flex items-center gap-3">
                                <img
                                    src={
                                        user.avatar ||
                                        `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`
                                    }
                                    alt={user.name}
                                    className="h-10 w-10 rounded-full"
                                />
                                <span className="font-semibold text-white">
                                    {user.name}
                                </span>
                            </div>
                            <textarea
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Write a caption..."
                                maxLength={2200}
                                className="flex-1 resize-none bg-transparent text-white placeholder-[#6a6a7a] focus:outline-none"
                                rows={6}
                            />
                            <div className="mt-2 flex items-center justify-between text-xs text-[#6a6a7a]">
                                <span>{caption.length}/2,200</span>
                                {progress && (
                                    <span className="flex items-center gap-2">
                                        <div className="loader h-4 w-4"></div>
                                        {progress}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
