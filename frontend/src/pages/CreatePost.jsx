import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaImage, FaTimes, FaArrowLeft } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import { ImageCropper } from "../components/post/ImageCropper";
import api from "../api/axios";
import { API_ENDPOINTS } from "../api/endpoints";

export const CreatePost = () => {
    const { id } = useParams(); // Post ID for editing
    const isEditMode = !!id;

    const [step, setStep] = useState(1);
    const [selectedImages, setSelectedImages] = useState([]); // Raw files (New uploads)
    const [croppedImages, setCroppedImages] = useState([]); // Blobs (New cropped)
    const [existingImages, setExistingImages] = useState([]); // URLs (Existing images)
    const [currentCropIndex, setCurrentCropIndex] = useState(0);
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const [progress, setProgress] = useState("");

    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (isEditMode) {
            fetchPostDetails();
        }
    }, [id]);

    const fetchPostDetails = async () => {
        try {
            const res = await api.get(API_ENDPOINTS.POSTS.DETAIL(id));
            const post = res.data.metadata;
            setCaption(post.content);
            setExistingImages(post.images || []);
            setStep(3); // Jump to details step
        } catch (error) {
            console.error("Failed to fetch post", error);
            navigate("/");
        } finally {
            setInitialLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="card-glass p-8 text-center">
                    <p className="text-white">
                        Please log in to {isEditMode ? "edit" : "create"} a
                        post.
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

    if (initialLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="loader"></div>
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
            // All done cropping new images, go to step 3
            setStep(3);
        }
    };

    const handleCancel = () => {
        if (isEditMode) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    const handleBack = () => {
        if (step === 2) {
            if (currentCropIndex > 0) {
                setCurrentCropIndex((prev) => prev - 1);
                setCroppedImages((prev) => prev.slice(0, -1));
            } else {
                setSelectedImages([]);
                setStep(1);
            }
        } else if (step === 3) {
            if (isEditMode) {
                // If editing, going back from step 3 usually means cancelling edit or adding more photos?
                // For simplicity, let's just go back to home or allow clearing added photos.
                // If we have selected new images, we can go back to cropping them?
                if (selectedImages.length > 0) {
                    // Go back to crop flow for new images
                    setStep(2);
                    setCurrentCropIndex(selectedImages.length - 1);
                    setCroppedImages((prev) => prev.slice(0, -1));
                } else {
                    // No new images, just existing. Go back to step 1 to add more?
                    setStep(1);
                }
            } else {
                setCurrentCropIndex(selectedImages.length - 1);
                setCroppedImages((prev) => prev.slice(0, -1));
                setStep(2);
            }
        }
    };

    const removeExistingImage = (indexToRemove) => {
        setExistingImages((prev) =>
            prev.filter((_, idx) => idx !== indexToRemove)
        );
    };

    const removeNewImage = (indexToRemove) => {
        setCroppedImages((prev) =>
            prev.filter((_, idx) => idx !== indexToRemove)
        );
        // Note: Mapping back to selectedImages isn't perfect here but works for display removal
    };

    const handleSubmit = async () => {
        setLoading(true);
        if (croppedImages.length > 0) {
            setProgress("Uploading images (0%)...");
        } else {
            setProgress("Saving...");
        }

        try {
            let uploadedImageNames = [];

            // 1. Upload New Images if any
            if (croppedImages.length > 0) {
                const formData = new FormData();
                croppedImages.forEach((blob) => {
                    formData.append("post-images", blob, "image.jpg");
                });

                const uploadRes = await api.post(
                    API_ENDPOINTS.POSTS.UPLOAD,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                        onUploadProgress: (progressEvent) => {
                            const percentCompleted = Math.round(
                                (progressEvent.loaded * 100) /
                                    progressEvent.total
                            );
                            setProgress(
                                `Uploading images (${percentCompleted}%)...`
                            );
                        },
                    }
                );
                uploadedImageNames = uploadRes.data.metadata;
            }

            // 2. Create or Update Post
            // Combine existing URLs + New Filenames
            const finalImages = [...existingImages, ...uploadedImageNames];

            if (finalImages.length === 0 && !caption.trim()) {
                alert("Please add some content to your post.");
                setLoading(false);
                return;
            }

            setProgress(isEditMode ? "Updating post..." : "Creating post...");

            if (isEditMode) {
                await api.put(API_ENDPOINTS.POSTS.UPDATE(id), {
                    content: caption,
                    images: finalImages,
                });
            } else {
                await api.post(API_ENDPOINTS.POSTS.CREATE, {
                    content: caption,
                    images: finalImages,
                });
            }

            navigate("/");
        } catch (error) {
            console.error("Failed to save post", error);
            alert(
                "Failed to save post: " +
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
                    {/* Left Button Logic: Cancel vs Back */}
                    {step === 1 || (isEditMode && step === 3) ? (
                        <button
                            onClick={handleCancel}
                            className="text-[#b8b8c8] hover:text-white text-sm font-medium"
                        >
                            Cancel
                        </button>
                    ) : (
                        <button
                            onClick={handleBack}
                            className="text-[#b8b8c8] hover:text-white"
                        >
                            <FaArrowLeft className="h-5 w-5" />
                        </button>
                    )}

                    <h2 className="font-semibold text-white">
                        {step === 1
                            ? isEditMode
                                ? "Edit Post"
                                : "New Post"
                            : step === 2
                            ? `Crop Image ${currentCropIndex + 1}/${
                                  selectedImages.length
                              }`
                            : isEditMode
                            ? "Edit Details"
                            : "Add Details"}
                    </h2>

                    {step === 3 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="font-semibold text-[#a855f7] hover:text-white disabled:opacity-50"
                        >
                            {loading
                                ? isEditMode
                                    ? "Updating..."
                                    : "Posting..."
                                : isEditMode
                                ? "Update"
                                : "Share"}
                        </button>
                    ) : (
                        <div className="w-5"></div>
                    )}
                </div>

                {/* Step 1: Select (Only show if not editing or explicitly went back to add more) */}
                {step === 1 && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-indigo-500/20 to-purple-500/20">
                            <FaImage className="h-10 w-10 text-[#6a6a7a]" />
                        </div>
                        <p className="mb-2 text-xl font-semibold text-white">
                            {isEditMode
                                ? "Add more photos"
                                : "Share your moment"}
                        </p>
                        <p className="mb-8 text-[#6a6a7a]">
                            Select photos to{" "}
                            {isEditMode ? "add" : "get started"}
                        </p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="btn-primary"
                        >
                            Select Photos
                        </button>
                        {isEditMode && existingImages.length > 0 && (
                            <button
                                onClick={() => setStep(3)}
                                className="mt-4 text-[#a855f7] hover:underline"
                            >
                                Skip to details
                            </button>
                        )}
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
                            <div className="p-2 text-center text-xs text-gray-500 uppercase font-bold tracking-wider">
                                Photos
                            </div>
                            <div
                                className={`grid gap-1 ${
                                    existingImages.length +
                                        croppedImages.length <=
                                    1
                                        ? "grid-cols-1"
                                        : "grid-cols-2"
                                }`}
                            >
                                {/* Existing Images */}
                                {existingImages.map((url, idx) => (
                                    <div
                                        key={`existing-${idx}`}
                                        className="relative group"
                                    >
                                        <img
                                            src={url}
                                            alt={`Existing ${idx}`}
                                            className="h-full w-full object-cover aspect-square"
                                        />
                                        <button
                                            onClick={() =>
                                                removeExistingImage(idx)
                                            }
                                            className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                                        >
                                            <FaTimes size={12} />
                                        </button>
                                    </div>
                                ))}

                                {/* New Cropped Images */}
                                {croppedImages.map((blob, idx) => (
                                    <div
                                        key={`new-${idx}`}
                                        className="relative group"
                                    >
                                        <img
                                            src={URL.createObjectURL(blob)}
                                            alt={`New ${idx}`}
                                            className="h-full w-full object-cover aspect-square border-2 border-[#a855f7]"
                                        />
                                        <button
                                            onClick={() => removeNewImage(idx)}
                                            className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                                        >
                                            <FaTimes size={12} />
                                        </button>
                                    </div>
                                ))}

                                <div
                                    className="flex items-center justify-center bg-[#2a2a38] aspect-square text-[#6a6a7a] hover:text-white cursor-pointer"
                                    onClick={() => {
                                        setStep(1);
                                    }}
                                >
                                    <div className="flex flex-col items-center">
                                        <FaImage size={24} />
                                        <span className="text-xs mt-1">
                                            Add
                                        </span>
                                    </div>
                                </div>
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
