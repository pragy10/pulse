import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FiShield, FiUsers, FiFileText, FiArrowRight, FiSettings } from 'react-icons/fi';

const ModPanel = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModeratedCommunities = async () => {
      try {
        const res = await api.get('/communities/moderating');
        if (res.data.success) {
          setCommunities(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch moderated communities", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModeratedCommunities();
  }, []);

  return (
    <div className="w-full max-w-[800px] mx-auto flex flex-col gap-6">
      
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <FiShield className="absolute -bottom-10 -right-10 text-[150px] text-gray-700 opacity-50" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/30">
              Moderator Access
            </span>
          </div>
          <h2 className="text-3xl font-black mb-2">Mod Panel</h2>
          <p className="text-gray-300 text-sm max-w-[80%] leading-relaxed">
            Welcome to your command center. Select a community below to review posts, manage comments, and pin important updates to the feed.
          </p>
        </div>
      </div>

      {/* COMMUNITIES LIST */}
      <div>
        <h3 className="font-bold text-gray-800 mb-4 px-2">Your Communities</h3>
        
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-400 font-medium animate-pulse">Loading your dashboard...</p>
          </div>
        ) : communities.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {communities.map((community) => (
              <div 
                key={community._id} 
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-200 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-[#4ADE80] uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded-md">
                      SDG {community.sdg_number}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{community.name}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2">{community.description}</p>
                  
                  <div className="flex items-center gap-4 mt-4 text-xs font-bold text-gray-400">
                    <div className="flex items-center gap-1">
                      <FiFileText /> {community.post_count || 0} Posts
                    </div>
                    <div className="flex items-center gap-1">
                      <FiUsers /> {community.moderators?.length || 1} Mods
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                  <button 
                    onClick={() => navigate(`/community/${community._id}`)}
                    className="flex-1 md:w-full py-2 px-4 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2"
                  >
                    Manage Feed <FiArrowRight />
                  </button>
                  
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
            <FiShield className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">No Communities Assigned</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              You haven't been assigned to moderate any SDG communities yet. An administrator must add you to a community's moderator list.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModPanel;