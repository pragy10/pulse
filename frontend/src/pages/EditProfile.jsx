import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FiCamera, FiArrowLeft, FiSave } from 'react-icons/fi';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', username: '', title: '', location: '', gender: '', birthday: '', phone: '', banner: '', avatar: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        title: user.title || '',
        location: user.location || '',
        gender: user.gender || '',
        birthday: user.birthday || '',
        phone: user.phone || '',
        banner: user.banner || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, [field]: reader.result }); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.put('/users/profile', formData);
      if (res.data.success) {
        updateUser(res.data.data); 
        navigate(`/profile/${user._id || user.id}`);
      }
    } catch (err) { 
      alert("Failed to update profile. " + (err.response?.data?.message || err.message)); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex items-center gap-4 mb-8">
        <button type="button" onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition"><FiArrowLeft className="text-xl"/></button>
        <h2 className="text-2xl font-bold">Edit Profile</h2>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative group h-32 bg-gray-50 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 flex flex-col items-center justify-center transition hover:border-green-400 cursor-pointer">
            {formData.banner ? <img src={formData.banner} className="w-full h-full object-cover" alt="Banner preview" /> : <FiCamera className="text-gray-400 text-2xl" />}
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageChange(e, 'banner')} />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none text-white text-[10px] font-bold tracking-wider">CHANGE BANNER</div>
          </div>
          <div className="relative group h-32 bg-gray-50 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 flex flex-col items-center justify-center transition hover:border-green-400 cursor-pointer">
            {formData.avatar ? <img src={formData.avatar} className="w-full h-full object-cover" alt="Avatar preview" /> : <FiCamera className="text-gray-400 text-2xl" />}
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageChange(e, 'avatar')} />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none text-white text-[10px] font-bold tracking-wider">CHANGE AVATAR</div>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">First Name</label>
            <input className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} placeholder="First Name" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Last Name</label>
            <input className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} placeholder="Last Name" />
          </div>
        </div>

        {/* Username and Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Username</label>
            <input className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Title</label>
            <input className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400" value={formData.title} placeholder="e.g. Environment Lover" onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>
        </div>

        {/* Gender and Birthday */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Gender</label>
            <select className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
              <option value="">Select Gender...</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Birthday</label>
            <input type="date" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400" value={formData.birthday} onChange={(e) => setFormData({...formData, birthday: e.target.value})} />
          </div>
        </div>

        {/* Location and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Location</label>
            <input className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400" value={formData.location} placeholder="City, Country" onChange={(e) => setFormData({...formData, location: e.target.value})} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number</label>
            <input type="tel" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400" value={formData.phone} placeholder="+1 234 567 8900" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
        </div>
        
        <button type="submit" disabled={isLoading} className="w-full py-4 mt-4 bg-[#4ADE80] text-white font-bold rounded-2xl shadow-lg shadow-green-100 flex items-center justify-center gap-2 hover:bg-green-500 transition disabled:opacity-70">
          <FiSave /> {isLoading ? 'Saving Changes...' : 'Save All Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;