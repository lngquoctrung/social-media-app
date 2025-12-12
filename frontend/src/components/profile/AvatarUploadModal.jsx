import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { AiOutlineClose } from "react-icons/ai";
import { HiSparkles } from "react-icons/hi";

// Helper function to create image from url
const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
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

const AvatarUploadModal = ({
    isOpen,
    onClose,
    imageSrc,
    onUpload,
    isLoading,
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        try {
            const croppedImageBlob = await getCroppedImg(
                imageSrc,
                croppedAreaPixels
            );
            onUpload(croppedImageBlob);
        } catch (e) {
            console.error(e);
        }
    };

    if (!isOpen || !imageSrc) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm transition-all duration-300">
            <div className="w-full max-w-md transforms overflow-hidden rounded-2xl border border-[#2a2a38] bg-[#1a1a24] p-8 shadow-2xl transition-all">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
                            <HiSparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Adjust Photo
                            </h2>
                            <p className="text-xs text-[#6a6a7a]">
                                Drag and zoom to crop
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full bg-[#2a2a38] p-2 text-[#6a6a7a] hover:bg-[#3f3f46] hover:text-white transition-colors"
                    >
                        <AiOutlineClose size={20} />
                    </button>
                </div>

                {/* Cropper */}
                <div className="relative h-64 w-full overflow-hidden rounded-xl border border-[#3a3a4a] bg-black">
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

                {/* Zoom Control */}
                <div className="mt-4">
                    <label className="text-xs font-medium text-[#b8b8c8] mb-2 block">
                        Zoom
                    </label>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(e.target.value)}
                        className="w-full h-2 bg-[#2a2a38] rounded-lg appearance-none cursor-pointer accent-[#a855f7]"
                    />
                </div>

                {/* Actions */}
                <div className="mt-8 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-xl px-6 py-2.5 font-semibold text-[#b8b8c8] hover:text-white hover:bg-[#2a2a38] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="btn-primary px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Saving..." : "Save Picture"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarUploadModal;
