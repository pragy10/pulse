import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import PostCard from "../components/PostCard";
import {
  FiMail,
  FiMapPin,
  FiUser,
  FiMessageSquare,
  FiEdit2,
  FiUserPlus
} from "react-icons/fi";

const Profile = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  
  // 1. VARIABLE INITIALIZATION (Done first to avoid ReferenceErrors)
  const cleanUserId = userId === "undefined" ? null : userId;
  const authId = authUser?._id || authUser?.id;
  const currentProfileId = cleanUserId || authId;
  const isOwnProfile = authId === currentProfileId;

  const [myPosts, setMyPosts] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  // Determine displayUser BEFORE the effects run
  const displayUser = profileUser || (isOwnProfile ? authUser : null);

  // 2. DATA FETCHING EFFECT
  useEffect(() => {
    const fetchAllData = async () => {
      if (!currentProfileId) return;
      
      setLoading(true);
      try {
        const userRes = await api.get(`/users/${currentProfileId}`);
        if (userRes.data.success) {
          setProfileUser(userRes.data.data);
          
          // Check if currently logged in user follows this profile
          if (authUser) {
            const myId = authUser._id || authUser.id;
            setIsFollowing(userRes.data.data.followers?.includes(myId));
          }
        }

        const postsRes = await api.get(`/posts?user=${currentProfileId}`);
        if (postsRes.data.success) {
          setMyPosts(postsRes.data.data);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [currentProfileId, authId]);

  // 3. FOLLOW HANDLER
  const handleFollow = async () => {
    try {
      const res = await api.post(`/users/${currentProfileId}/follow`);
      if (res.data.success) {
        setIsFollowing(res.data.isFollowing);
        
        // Update local state so numbers change instantly
        setProfileUser(prev => ({
          ...prev,
          followers: res.data.isFollowing 
            ? [...(prev.followers || []), authId]
            : (prev.followers || []).filter(id => id !== authId)
        }));
      }
    } catch (err) {
      console.error("Follow error", err);
    }
  };

  const isValidImage = (str) => str?.startsWith('http') || str?.startsWith('data:');
  const hasFullName = displayUser?.firstName || displayUser?.lastName;
  const displayName = hasFullName 
    ? `${displayUser.firstName || ''} ${displayUser.lastName || ''}`.trim() 
    : displayUser?.username;

  if (!displayUser && !loading) {
    return <div className="text-center py-20 text-gray-500 font-medium">User not found.</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-[800px] mx-auto">
      
      {/* HEADER CARD */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        <div className="h-40 md:h-48 bg-gradient-to-r from-green-100 to-blue-100 relative">
          {isValidImage(displayUser?.banner) && (
            <img src={displayUser.banner} className="w-full h-full object-cover" alt="Banner" />
          )}
        </div>

        <div className="px-6 md:px-8 pb-6 relative">
          <div className="flex justify-between items-end -mt-16 mb-4 relative z-10">
            <img
              src={isValidImage(displayUser?.avatar) ? displayUser.avatar : `https://ui-avatars.com/api/?name=${displayUser?.username || 'User'}`}
              className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white object-cover"
              alt="Avatar"
            />
            
            <div className="flex gap-2 mb-2">
              <button className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition">
                <FiMessageSquare />
              </button>

              {isOwnProfile ? (
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="px-6 py-2 bg-[#4ADE80] text-white font-bold rounded-xl flex items-center gap-2 hover:bg-green-500 transition shadow-sm"
                >
                  <FiEdit2 /> Edit Profile
                </button>
              ) : (
                <button 
                  onClick={handleFollow}
                  className={`px-6 py-2 font-bold rounded-xl flex items-center gap-2 transition shadow-sm ${
                    isFollowing ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {isFollowing ? 'Following' : <><FiUserPlus /> Follow</>}
                </button>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900">{displayName || "Loading..."}</h2>
            <p className="text-gray-500 text-sm font-medium mt-1">
              <span className="text-gray-400">@{displayUser?.username}</span> • {displayUser?.title || "Member"}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 mt-4">
              <div className="text-sm font-bold text-gray-800 cursor-pointer hover:underline">
                {displayUser?.following?.length || 0} <span className="text-gray-400 font-medium">Following</span>
              </div>
              <div className="text-sm font-bold text-gray-800 cursor-pointer hover:underline">
                {displayUser?.followers?.length || 0} <span className="text-gray-400 font-medium">Followers</span>
              </div>
              <div className="bg-green-50 text-[#4ADE80] text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 border border-green-100">
                🌿 {displayUser?.green_karma || 0} Karma
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT SECTION */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiUser className="text-[#4ADE80]" /> {displayUser?.gender || "Not specified"}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiMapPin className="text-[#4ADE80]" /> {displayUser?.location || "Global"}
          </div>
          {displayUser?.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiMail className="text-[#4ADE80]" /> {displayUser.email}
            </div>
          )}
        </div>
      </div>

      {/* POSTS LIST */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-8 px-4 border-b border-gray-200 font-bold text-sm">
          <button className="pb-2 border-b-2 border-[#4ADE80] text-[#4ADE80]">Posts</button>
          <button className="pb-2 text-gray-400 hover:text-gray-600 transition">History</button>
        </div>
        
        {loading ? (
          <p className="text-center py-10 text-gray-400 animate-pulse font-medium">Loading impact...</p>
        ) : myPosts.length > 0 ? (
          myPosts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <div className="bg-white p-10 rounded-3xl text-center border-2 border-dashed border-gray-100 mt-4">
            <p className="text-gray-400 font-medium">No posts yet. Start sharing!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;