import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import { FiArrowLeft, FiUsers, FiFileText, FiShield } from 'react-icons/fi';

const CommunityView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityData = async () => {
      setLoading(true);
      try {
        // 1. Fetch community details
        const commRes = await api.get(`/communities/${id}`);
        if (commRes.data.success) {
          setCommunity(commRes.data.data);
        }

        // 2. Fetch posts specifically for this community
        const postsRes = await api.get(`/posts?comm_id=${id}`);
        if (postsRes.data.success) {
          setPosts(postsRes.data.data);
        }
      } catch (err) {
        console.error("Error fetching community data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCommunityData();
  }, [id]);

  // Check if current user is a moderator for this community
  const authId = user?._id || user?.id;
  const isMod = community?.moderators?.includes(authId) || user?.role === 'admin';

  if (loading) return <div className="text-center py-20 animate-pulse text-gray-500 font-bold">Loading community feed...</div>;
  if (!community) return <div className="text-center py-20 text-gray-500 font-bold">Community not found.</div>;

  return (
    <div className="w-full max-w-[800px] mx-auto flex flex-col gap-6">
      
      {/* HEADER BANNER */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#4ADE80] to-blue-500 opacity-10" />
        
        <div className="relative z-10">
          <button onClick={() => navigate(-1)} className="mb-4 p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition">
            <FiArrowLeft />
          </button>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-green-100 text-[#4ADE80] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              SDG {community.sdg_number}
            </span>
            {isMod && (
              <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <FiShield /> Moderator View
              </span>
            )}
          </div>
          
          <h1 className="text-3xl font-black text-gray-900 mb-2">{community.name}</h1>
          <p className="text-gray-600 leading-relaxed mb-6">{community.description}</p>
          
          <div className="flex gap-6 text-sm font-bold text-gray-500">
            <div className="flex items-center gap-2"><FiUsers className="text-gray-400" /> {community.member_count || 0} Members</div>
            <div className="flex items-center gap-2"><FiFileText className="text-gray-400" /> {posts.length} Posts</div>
          </div>
        </div>
      </div>

      {/* POSTS FEED */}
      <div className="flex flex-col gap-4">
        <h3 className="font-bold text-gray-800 px-2 border-b border-gray-200 pb-2">Community Feed</h3>
        
        {posts.length > 0 ? (
          posts.map(post => <PostCard key={post._id} post={post} />)
        ) : (
          <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-100 mt-2">
            <FiFileText className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">No posts yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">Be the first to share an impact story in this community!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityView;