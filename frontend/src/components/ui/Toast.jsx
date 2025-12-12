import React, { useEffect } from "react";
import {
    FaCheckCircle,
    FaInfoCircle,
    FaExclamationCircle,
    FaTimes,
} from "react-icons/fa";

const Toast = ({ message, type = "info", onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <FaCheckCircle className="text-green-500" />,
        info: <FaInfoCircle className="text-blue-500" />,
        error: <FaExclamationCircle className="text-red-500" />,
    };

    const containerStyles = {
        success: "border-green-500/50 bg-green-500/10 text-green-200",
        info: "border-blue-500/50 bg-blue-500/10 text-blue-200",
        error: "border-red-500/50 bg-red-500/10 text-red-200",
    };

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-300 ${
                containerStyles[type] || containerStyles.info
            }`}
        >
            <span className="text-lg">{icons[type] || icons.info}</span>
            <p className="text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                className="ml-auto text-white/50 hover:text-white"
            >
                <FaTimes />
            </button>
        </div>
    );
};

export default Toast;
