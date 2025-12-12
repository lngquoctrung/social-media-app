import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const EditProfileModal = ({ isOpen, onClose, currentUser, onUpdate }) => {
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [birthday, setBirthday] = useState("");
    const [location, setLocation] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setName(currentUser.name || "");
            setGender(currentUser.gender || "male");
            // Format birthday to YYYY-MM-DD for input[type="date"]
            if (currentUser.birthday) {
                setBirthday(
                    new Date(currentUser.birthday).toISOString().split("T")[0]
                );
            } else {
                setBirthday("");
            }
            setLocation(currentUser.location || "");
        }
    }, [currentUser, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const updatedData = {
                name,
                gender,
                birthday,
                location,
            };
            await onUpdate(updatedData);
            onClose();
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm transition-all duration-300">
            <div className="w-full max-w-md transform overflow-hidden rounded-2xl border border-[#2a2a38] bg-[#1a1a24] p-8 shadow-2xl transition-all">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            Edit Profile
                        </h2>
                        <p className="mt-1 text-sm text-[#6a6a7a]">
                            Update your personal details
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full bg-[#2a2a38] p-2 text-[#6a6a7a] hover:bg-[#3f3f46] hover:text-white transition-colors"
                    >
                        <AiOutlineClose size={20} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#b8b8c8]">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                            placeholder="Your full name"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#b8b8c8]">
                            Gender
                        </label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="input-field appearance-none"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#b8b8c8]">
                            Birthday
                        </label>
                        <input
                            type="date"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#b8b8c8]">
                            Location
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="input-field"
                            placeholder="City, Country"
                        />
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-6 py-2.5 font-semibold text-[#b8b8c8] hover:text-white hover:bg-[#2a2a38] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
