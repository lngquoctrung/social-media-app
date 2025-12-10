import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
        image.src = url;
    });

async function getCroppedImg(imageSrc, pixelCrop) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return null;
    }

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

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                // reject(new Error('Canvas is empty'));
                console.error("Canvas is empty");
                return;
            }
            blob.name = "newFile.jpeg";
            resolve(blob);
        }, "image/jpeg");
    });
}

export const ImageCropper = ({
    image,
    onCropComplete,
    onCancel,
    submitLabel = "Apply Crop",
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = (crop) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom) => {
        setZoom(zoom);
    };

    const handleCropComplete = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(image, croppedAreaPixels);
            onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
        }
    }, [image, croppedAreaPixels, onCropComplete]);

    return (
        <div className="flex h-full flex-col">
            <div className="relative flex-1 bg-black">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1} // Square crop for posts as well? User asked for "crop" but didn't specify ratio. Let's keep 4/3 or 1? Register uses 1. Let's start with 1.
                    onCropChange={onCropChange}
                    onCropComplete={(croppedArea, croppedAreaPixels) =>
                        setCroppedAreaPixels(croppedAreaPixels)
                    }
                    onZoomChange={onZoomChange}
                />
            </div>
            <div className="space-y-4 bg-[#1a1a24] p-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[#b8b8c8]">Zoom</span>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(e.target.value)}
                        className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-[#2a2a38] accent-[#a855f7]"
                    />
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 rounded-lg bg-[#2a2a38] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#3f3f46]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCropComplete}
                        className="btn-primary flex-1"
                    >
                        {submitLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};
