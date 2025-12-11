import { FaExclamationTriangle } from "react-icons/fa";

export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    isDanger = false,
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-[#3a3a4a] bg-[#1a1a24] shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <div className="flex items-center gap-4">
                        <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                                isDanger
                                    ? "bg-red-500/10 text-red-500"
                                    : "bg-[#a855f7]/10 text-[#a855f7]"
                            }`}
                        >
                            <FaExclamationTriangle className="text-xl" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">
                                {title}
                            </h3>
                            <p className="mt-1 text-sm text-[#a855f7]/80">
                                {message}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-[#b8b8c8] hover:bg-[#2a2a38] hover:text-white transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
                                isDanger
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-[#a855f7] hover:bg-[#9333ea]"
                            }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
