import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  FiHome, FiUser, FiCompass, FiSettings, 
  FiBell, FiMessageSquare, FiChevronDown, FiPlus, FiEdit3, FiAward
} from 'react-icons/fi';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth(); // Brought in logout here
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch dynamic right sidebar data
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await api.get('/users/suggestions'); 
        if (res.data.success) {
          setSuggestedUsers(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching suggestions", err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchSuggestions();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/', match: '/', icon: <FiHome />},
    { 
      name: 'Profile', 
      path: user?._id ? `/profile/${user._id}` : '/profile', 
      match: '/profile', icon: <FiUser />
    },
    { name: 'Explore Communities', path: '/explore', match: '/explore', icon: <FiCompass />},
    { name: 'Leaderboard', path: '/leaderboard', match: '/leaderboard', icon: <FiAward /> },
    { name: 'Settings', path: '/settings', match: '/settings', icon: <FiSettings /> },
  ];

  // Helper to safely render avatars
  const getSafeAvatar = (avatarStr, username) => {
    if (avatarStr && (avatarStr.startsWith('http') || avatarStr.startsWith('data:'))) {
      return avatarStr;
    }
    return `https://ui-avatars.com/api/?name=${username || 'User'}`;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-800 font-sans flex justify-center">
      
      {/* ================= GLOBAL HEADER ================= */}
      <div className="fixed top-0 right-0 w-full flex justify-end items-center p-4 bg-[#F8F9FA] z-20 pr-8 xl:pr-12 gap-4">
        <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition">
          <FiMessageSquare className="text-gray-700" />
        </button>
        <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition">
          <FiBell className="text-gray-700" />
        </button>
        
        <div className="flex items-center gap-4 ml-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(user?._id ? `/profile/${user._id}` : '/profile')}>
            <img 
              src={getSafeAvatar(user?.avatar, user?.username)} 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover" 
            />
            <span className="font-semibold text-sm">{user?.username || 'Loading...'}</span>
            <FiChevronDown className="text-gray-500 text-sm" />
          </div>
          <button 
            onClick={handleLogout}
            className="text-xs font-bold text-gray-500 hover:text-red-500 transition px-2 py-1 rounded-md hover:bg-red-50"
            title="Logout"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] w-full flex flex-col lg:flex-row gap-6 px-4 pt-20 pb-8">
        
        {/* ================= LEFT SIDEBAR ================= */}
        <div className="hidden lg:flex flex-col w-1/4 max-w-[280px] sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="mb-8 px-4 cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-4xl font-extrabold text-[#4ADE80] tracking-tight">Pulse</h1>
          </div>

          <nav className="flex flex-col gap-2 mb-8 px-2">
            {navItems.map((item) => {
              const isActive = item.match === '/' 
                ? location.pathname === '/' 
                : location.pathname.startsWith(item.match);

              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition text-left w-full font-semibold ${
                    isActive 
                    ? 'bg-gray-100 text-[#4ADE80]' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span> {item.name}
                </button>
              );
            })}
          </nav>

          <div className="px-4">
            <button 
              onClick={() => navigate('/post')}
              className="w-full py-3 bg-[#4ADE80] text-white font-bold rounded-xl shadow-lg shadow-green-200 hover:bg-green-500 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              <FiEdit3 className="text-lg" /> Share Impact
            </button>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="flex-1 max-w-[600px] w-full mx-auto">
          {children}
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <div className="hidden xl:flex flex-col w-1/4 max-w-[280px] sticky top-20 h-[calc(100vh-80px)] gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-[#4ADE80] mb-4 uppercase tracking-wide">People you may know</h3>
            <div className="flex flex-col gap-4">
              {loadingUsers ? (
                <p className="text-xs text-gray-400">Finding members...</p>
              ) : (
                suggestedUsers.map(u => (
                  <div key={u._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={getSafeAvatar(u.avatar, u.username)} 
                        className="w-10 h-10 rounded-full object-cover" 
                        alt="user" 
                      />
                      <div>
                        <h4 className="text-xs font-bold text-gray-800">{u.username}</h4>
                        <p className="text-[10px] text-gray-400">{u.role || 'Member'}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-[#4ADE80] transition">
                      <FiPlus className="text-lg" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <button className="mt-4 text-xs font-bold text-[#4ADE80] hover:underline uppercase">See more</button>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-[#4ADE80] mb-4 uppercase tracking-wide">Suggested Communities</h3>
            <p className="text-[10px] text-gray-400 italic">Based on your recent sustainability stories.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Layout;