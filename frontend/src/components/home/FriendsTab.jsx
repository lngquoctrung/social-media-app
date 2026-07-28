import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export const FriendsTab = () => {
    const [mutualFriends, setMutualFriends] = useState([]);
    const [recommendedFriends, setRecommendedFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFriendsData = async () => {
            try {
                setLoading(true);
                const [mutualRes, recommendedRes] = await Promise.all([
                    api.get("/users/friends/mutual"),
                    api.get("/users/friends/recommendations")
                ]);

                setMutualFriends(mutualRes.data.metadata || []);
                setRecommendedFriends(recommendedRes.data.metadata || []);
            } catch (error) {
                console.error("Error fetching friends data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFriendsData();
    }, []);

    const handleFollowToggle = async (userId) => {
        try {
            const res = await api.post(`/users/${userId}/follow`);
            const isFollowing = res.data.metadata.followed;
            
            // Re-fetch data or manually update state if needed
            // A simple approach is just refetching to ensure mutual lists are updated properly
            const [mutualRes, recommendedRes] = await Promise.all([
                api.get("/users/friends/mutual"),
                api.get("/users/friends/recommendations")
            ]);

            setMutualFriends(mutualRes.data.metadata || []);
            setRecommendedFriends(recommendedRes.data.metadata || []);
        } catch (error) {
            console.error("Failed to toggle follow", error);
        }
    };

    if (loading) {
        return (
            <div className="flex h-40 items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Mutual Friends Section */}
            <div className="bg-[#1a1a24] rounded-xl p-4 md:p-6 border border-[#2a2a38]">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Mutual Friends
                </h2>
                
                {mutualFriends.length === 0 ? (
                    <div className="text-center py-8 text-[#a1a1aa]">
                        <p>No mutual friends yet.</p>
                        <p className="text-sm mt-1">Start following people to build your network!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {mutualFriends.map(friend => (
                            <div key={friend._id} className="flex items-center justify-between p-3 rounded-lg bg-[#22222e] hover:bg-[#2a2a38] transition-colors border border-[#2a2a38]">
                                <Link to={`/profile/${friend._id}`} className="flex items-center gap-3">
                                    <img 
                                        src={friend.avatar || `https://ui-avatars.com/api/?name=${friend.name}&background=random`} 
                                        alt={friend.name} 
                                        className="h-10 w-10 rounded-full object-cover border border-[#3f3f46]"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-200 text-sm">{friend.name}</p>
                                        <p className="text-xs text-[#71717a]">@{friend.email?.split("@")[0]}</p>
                                    </div>
                                </Link>
                                <button 
                                    onClick={() => handleFollowToggle(friend._id)}
                                    className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[#3f3f46] hover:bg-[#52525b] text-white transition-colors"
                                >
                                    Unfollow
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recommended Friends Section */}
            <div className="bg-[#1a1a24] rounded-xl p-4 md:p-6 border border-[#2a2a38]">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#a855f7]"></span>
                    People You May Know
                </h2>
                
                {recommendedFriends.length === 0 ? (
                    <div className="text-center py-8 text-[#a1a1aa]">
                        <p>No new recommendations at this time.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {recommendedFriends.map(user => (
                            <div key={user._id} className="flex items-center justify-between p-3 rounded-lg bg-[#22222e] hover:bg-[#2a2a38] transition-colors border border-[#2a2a38]">
                                <Link to={`/profile/${user._id}`} className="flex items-center gap-3">
                                    <img 
                                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                                        alt={user.name} 
                                        className="h-10 w-10 rounded-full object-cover border border-[#3f3f46]"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-200 text-sm">{user.name}</p>
                                        <p className="text-xs text-[#71717a]">@{user.email?.split("@")[0]}</p>
                                    </div>
                                </Link>
                                <button 
                                    onClick={() => handleFollowToggle(user._id)}
                                    className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[#6366f1] hover:bg-[#4f46e5] text-white transition-colors"
                                >
                                    Follow
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
