import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FiAward, FiTrendingUp, FiUser } from 'react-icons/fi';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/users/leaderboard');
        if (res.data.success) setLeaders(res.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="w-full max-w-[800px] mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-[#4ADE80] to-green-500 p-8 text-white text-center">
        <FiAward className="text-5xl mx-auto mb-4" />
        <h2 className="text-3xl font-black">Impact Leaderboard</h2>
        <p className="opacity-90 font-medium mt-1">Celebrating our top green contributors</p>
      </div>

      <div className="p-6">
        {loading ? (
          <p className="text-center py-10 text-gray-400 animate-pulse">Ranking members...</p>
        ) : (
          <div className="flex flex-col gap-3">
            {leaders.map((user, index) => (
              <div 
                key={user._id} 
                onClick={() => navigate(`/profile/${user._id}`)}
                className={`flex items-center justify-between p-4 rounded-2xl transition cursor-pointer border ${
                  index === 0 ? 'bg-yellow-50 border-yellow-100' : 'hover:bg-gray-50 border-transparent'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 text-center font-black ${
                    index === 0 ? 'text-yellow-500 text-xl' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-gray-300'
                  }`}>
                    {index + 1}
                  </span>
                  <img 
                    src={user.avatar?.startsWith('http') ? user.avatar : `https://ui-avatars.com/api/?name=${user.username}`} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    alt="user"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {user.firstName ? `${user.firstName} ${user.lastName}` : user.username}
                    </h4>
                    <p className="text-xs text-gray-400 font-medium">@{user.username} • {user.title}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-green-50 text-[#4ADE80] px-4 py-2 rounded-xl border border-green-100">
                  <FiTrendingUp />
                  <span className="font-black text-sm">{user.green_karma} <span className="text-[10px] uppercase">Karma</span></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;