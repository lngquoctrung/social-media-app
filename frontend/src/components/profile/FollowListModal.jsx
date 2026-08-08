import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";
import { useAuth } from "../../context/AuthContext";

export default function FollowListModal({ isOpen, onClose, type, userId }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    useEffect(() => {
        if (isOpen && userId && type) {
            fetchUsers();
        }
    }, [isOpen, userId, type]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const endpoint = type === 'followers' 
                ? API_ENDPOINTS.USERS.FOLLOWERS(userId) 
                : API_ENDPOINTS.USERS.FOLLOWING(userId);
            const res = await api.get(endpoint);
            setUsers(res.data.metadata || []);
        } catch (error) {
            console.error(`Failed to fetch ${type}`, error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const title = type === 'followers' ? 'Followers' : 'Following';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            <div className="relative w-full max-w-md rounded-2xl bg-[#1a1a24] shadow-2xl border border-[#3a3a4a] overflow-hidden flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between border-b border-[#3a3a4a] p-4 shrink-0">
                    <h2 className="text-xl font-bold text-white capitalize">{title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full bg-[#2a2a38] p-2 text-gray-400 hover:bg-[#3f3f46] hover:text-white transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto flex-1">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="loader border-[#a855f7]"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">
                            No {title.toLowerCase()} yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {users.map((u) => (
                                <div key={u._id} className="flex items-center justify-between gap-3">
                                    <div 
                                        className="flex items-center gap-3 cursor-pointer group flex-1"
                                        onClick={() => {
                                            onClose();
                                            navigate(`/profile/${u._id}`);
                                        }}
                                    >
                                        <img 
                                            src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=random`} 
                                            alt={u.name} 
                                            className="w-10 h-10 rounded-full object-cover border border-[#3a3a4a] group-hover:border-[#a855f7] transition-colors"
                                        />
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-white font-semibold group-hover:underline truncate">{u.name}</span>
                                            <span className="text-xs text-gray-400 truncate">@{u.email?.split("@")[0] || u.name.toLowerCase().replace(/\s/g, "")}</span>
                                        </div>
                                    </div>
                                    {currentUser && currentUser._id !== u._id && (
                                        <button 
                                            onClick={() => {
                                                onClose();
                                                navigate(`/profile/${u._id}`);
                                            }}
                                            className="px-4 py-1.5 rounded-lg bg-[#2a2a38] text-white text-sm font-medium hover:bg-[#3f3f46] transition-colors shrink-0"
                                        >
                                            View
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
