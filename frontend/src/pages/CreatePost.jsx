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
    const [selectedImages, setSelectedImages] = useState([]); // Raw files
    const [croppedImages, setCroppedImages] = useState([]); // Blobs
    const [currentCropIndex, setCurrentCropIndex] = useState(0);
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
            const files = Array.from(e.target.files);
            // Read all files as data URLs for cropping
            Promise.all(
                files.map((file) => {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (e) => resolve(e.target.result);
                        reader.readAsDataURL(file);
                    });
                })
            ).then((results) => {
                setSelectedImages(results);
                setCroppedImages([]);
                setCurrentCropIndex(0);
                setStep(2); // Start cropping
            });
        }
    };

    const handleCropComplete = (blob) => {
        const newCroppedImages = [...croppedImages, blob];
        setCroppedImages(newCroppedImages);

        if (currentCropIndex < selectedImages.length - 1) {
            // Move to next image
            setCurrentCropIndex((prev) => prev + 1);
        } else {
            // All done
            setStep(3);
        }
    };

    const handleBack = () => {
        if (step === 2) {
            if (currentCropIndex > 0) {
                // Go back to previous crop
                setCurrentCropIndex((prev) => prev - 1);
                setCroppedImages((prev) => prev.slice(0, -1));
            } else {
                // Back to selection
                setSelectedImages([]);
                setCroppedImages([]);
                setStep(1);
            }
        } else if (step === 3) {
            // Back to cropping the last image (reset logic slightly simplified for UX)
            // It's complicated to "uncrop" the last one.
            // Better to restart or just allow editing caption.
            // For now, let's allow going back to start to keep it simple as standard behavior
            // Or better: Re-enter crop flow for the last image?
            // Let's go back to step 2 with index at end?
            setCurrentCropIndex(selectedImages.length - 1);
            setCroppedImages((prev) => prev.slice(0, -1));
            setStep(2);
        }
    };

    const handleSubmit = async () => {
        if (croppedImages.length === 0) return;

        setLoading(true);
        setProgress("Uploading images (0%)...");

        try {
            const formData = new FormData();
            croppedImages.forEach((blob) => {
                formData.append("post-images", blob, "image.jpg");
            });

            // 1. Upload Images
            const uploadRes = await api.post(
                API_ENDPOINTS.POSTS.UPLOAD,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setProgress(
                            `Uploading images (${percentCompleted}%)...`
                        );
                    },
                }
            );

            // 2. Create Post
            setProgress("Creating post...");
            await api.post(API_ENDPOINTS.POSTS.CREATE, {
                content: caption,
                images: uploadRes.data.metadata,
            });

            navigate("/");
        } catch (error) {
            console.error("Failed to create post", error);
            alert(
                "Failed to create post: " +
                    (error.response?.data?.message || error.message)
            );
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
                            ? `Crop Image ${currentCropIndex + 1}/${
                                  selectedImages.length
                              }`
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
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-indigo-500/20 to-purple-500/20">
                            <FaImage className="h-10 w-10 text-[#6a6a7a]" />
                        </div>
                        <p className="mb-2 text-xl font-semibold text-white">
                            Share your moment
                        </p>
                        <p className="mb-8 text-[#6a6a7a]">
                            Select photos to get started
                        </p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="btn-primary"
                        >
                            Select Photos
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>
                )}

                {/* Step 2: Sequential Crop */}
                {step === 2 && selectedImages[currentCropIndex] && (
                    <div className="flex flex-col h-[60vh] md:h-[500px]">
                        <ImageCropper
                            key={currentCropIndex} // Force remount on index change
                            image={selectedImages[currentCropIndex]}
                            onCropComplete={handleCropComplete}
                            onCancel={handleBack}
                            submitLabel={
                                currentCropIndex < selectedImages.length - 1
                                    ? "Next"
                                    : "Finish Cropping"
                            }
                        />
                    </div>
                )}

                {/* Step 3: Caption & Preview */}
                {step === 3 && (
                    <div className="md:flex">
                        <div className="relative w-full bg-[#1a1a24] md:w-1/2 overflow-y-auto max-h-[500px]">
                            <div
                                className={`grid gap-1 ${
                                    croppedImages.length === 1
                                        ? "grid-cols-1"
                                        : "grid-cols-2"
                                }`}
                            >
                                {croppedImages.map((blob, idx) => (
                                    <img
                                        key={idx}
                                        src={URL.createObjectURL(blob)}
                                        alt={`Preview ${idx}`}
                                        className="h-full w-full object-cover aspect-square"
                                    />
                                ))}
                            </div>
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
                                    <span className="flex items-center gap-2 text-[#a855f7]">
                                        <div className="loader h-4 w-4 border-[#a855f7]"></div>
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
