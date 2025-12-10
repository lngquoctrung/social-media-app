import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

export const ImageCropper = ({ image, onCropComplete, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropCompleteHandler = useCallback(
        (croppedArea, croppedAreaPixels) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        []
    );

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const img = new Image();
            img.addEventListener("load", () => resolve(img));
            img.addEventListener("error", (error) => reject(error));
            img.crossOrigin = "anonymous";
            img.src = url;
        });

    const getCroppedImg = async (imageSrc, pixelCrop) => {
        const img = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return null;

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            img,
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
            canvas.toBlob(
                (blob) => {
                    if (blob) resolve(blob);
                },
                "image/jpeg",
                0.9
            );
        });
    };

    const handleDone = async () => {
        try {
            const croppedImage = await getCroppedImg(image, croppedAreaPixels);
            if (croppedImage) onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="flex flex-col">
            <div className="relative aspect-square w-full bg-black">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onCropComplete={onCropCompleteHandler}
                    onZoomChange={setZoom}
                    showGrid={false}
                />
            </div>

            <div className="flex items-center gap-4 border-t border-[#3a3a4a] p-4">
                <span className="text-xs text-[#6a6a7a]">Zoom</span>
                <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-[#3a3a4a] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-indigo-500 [&::-webkit-slider-thumb]:to-purple-500"
                />
                <button
                    onClick={handleDone}
                    className="font-semibold text-[#a855f7] hover:text-white"
                >
                    Next
                </button>
            </div>
        </div>
    );
};
