import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FiLock, FiTrash2, FiShield, FiCheckCircle } from 'react-icons/fi';

const Settings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('password');
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [status, setStatus] = useState({ msg: '', type: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      if (res.data.success) {
        setStatus({ msg: 'Password changed successfully!', type: 'success' });
        setPasswords({ current: '', new: '' });
      }
    } catch (err) {
      setStatus({ msg: err.response?.data?.message || 'Error updating password', type: 'error' });
    }
  };

  const handleModRequest = async () => {
    try {
      const res = await api.post('/users/request-mod');
      if (res.data.success) setStatus({ msg: 'Moderator request sent!', type: 'success' });
    } catch (err) { setStatus({ msg: 'Failed to send request', type: 'error' }); }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("WARNING: This will permanently delete your account and all your posts. Proceed?")) {
      try {
        const res = await api.delete('/users/delete-account');
        if (res.data.success) {
          logout();
          navigate('/register');
        }
      } catch (err) { alert("Delete failed"); }
    }
  };

  return (
    <div className="w-full max-w-[700px] mx-auto flex flex-col gap-6 p-4">
      <h2 className="text-3xl font-black text-gray-900">Settings</h2>

      {status.msg && (
        <div className={`p-4 rounded-2xl border font-bold text-sm flex items-center gap-2 ${
          status.type === 'success' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'
        }`}>
          {status.type === 'success' && <FiCheckCircle />} {status.msg}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[450px]">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-1/3 bg-gray-50 p-4 border-r border-gray-100 flex flex-col gap-2">
          <button onClick={() => setActiveTab('password')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === 'password' ? 'bg-white text-[#4ADE80] shadow-sm' : 'text-gray-500'}`}>
            <FiLock /> Security
          </button>
          <button onClick={() => setActiveTab('moderator')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === 'moderator' ? 'bg-white text-[#4ADE80] shadow-sm' : 'text-gray-500'}`}>
            <FiShield /> Community
          </button>
          <button onClick={() => setActiveTab('danger')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === 'danger' ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500'}`}>
            <FiTrash2 /> Danger Zone
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <h3 className="font-bold text-gray-800">Change Password</h3>
              <input type="password" placeholder="Current Password" required className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-green-400 outline-none" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} />
              <input type="password" placeholder="New Password" required className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-green-400 outline-none" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} />
              <button type="submit" className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition">Update Password</button>
            </form>
          )}

          {activeTab === 'moderator' && (
            <div className="text-center space-y-6 py-8">
              <FiShield className="text-5xl text-blue-400 mx-auto" />
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Become a Moderator</h3>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">Help us verify sustainability impacts and keep the Pulse community safe and clean.</p>
              </div>
              <button onClick={handleModRequest} className="px-8 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition shadow-lg shadow-blue-100">Submit Application</button>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-6">
              <h3 className="font-bold text-red-500">Delete Account</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Once you delete your account, there is no going back. All your karma, posts, and history will be wiped from our servers.</p>
              <button onClick={handleDeleteAccount} className="w-full py-3 border-2 border-red-500 text-red-500 font-bold rounded-xl hover:bg-red-50 transition">Delete My Account Permanently</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;