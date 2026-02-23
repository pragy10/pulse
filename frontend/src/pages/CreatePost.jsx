import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  FiHome, FiUser, FiCompass, FiSettings, 
  FiBell, FiMessageSquare, FiChevronDown, FiImage, FiCpu, FiArrowLeft, FiX
} from 'react-icons/fi';

const getSDGName = (tag) => {
  const sdgs = [
    "No Poverty", "Zero Hunger", "Good Health", "Quality Education",
    "Gender Equality", "Clean Water", "Affordable Energy", "Decent Work",
    "Infrastructure", "Reduced Inequality", "Sustainable Cities", "Consumption",
    "Climate Action", "Life Below Water", "Life on Land", "Justice", "Partnerships"
  ];
  return sdgs[tag - 1] || "Sustainable Action";
};

const ScoreGauge = ({ score }) => {
  const radius = 40;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-full max-w-[200px] mx-auto flex flex-col items-center">
      <svg viewBox="0 0 100 55" className="w-full h-auto overflow-visible">
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />
        <path 
          d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#4ADE80" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000 ease-out"
        />
        <text x="50" y="45" textAnchor="middle" className="text-2xl font-black fill-gray-800">{score}</text>
      </svg>
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Impact Rating</p>
    </div>
  );
};

const CreatePost = () => {
  const navigate = useNavigate();
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);       // Store the actual file
  const [imagePreview, setImagePreview] = useState(null); // Store the local preview URL
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Results State
  const [postResult, setPostResult] = useState(null);

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Creates a temporary local URL to show the user
    }
  };

  // Remove Selected Image
  const clearImage = (e) => {
    e.stopPropagation(); // Prevents triggering the upload click again
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return alert("Please fill in both title and content!");

    setIsSubmitting(true);
    try {
      // Create FormData object to handle the file upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      
      // 'image' must match the field name your Node.js multer middleware expects 
      // e.g., upload.single('image')
      if (imageFile) {
        formData.append('image', imageFile); 
      }

      // Send the request. Axios automatically sets the correct multipart/form-data headers
      const response = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setPostResult(response.data.data);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to process post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
          
          {!postResult ? (
            /* ================= STATE 1: SHARE YOUR IMPACT FORM ================= */
            <div className="bg-white w-full max-w-3xl p-8 rounded-[12px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] h-fit">
              <h2 className="text-3xl font-extrabold text-[#4ADE80] mb-8">Share Your Impact</h2>
              
              {/* INTERACTIVE IMAGE DROPZONE */}
              <div 
                className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer mb-6 relative overflow-hidden group"
                onClick={() => document.getElementById('imageUpload').click()}
              >
                <input 
                  type="file" 
                  id="imageUpload" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  disabled={isSubmitting}
                />
                
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    {/* Dark overlay with an 'X' to remove image */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={clearImage}
                        className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50 hover:scale-110 transition-transform"
                        title="Remove Image"
                      >
                        <FiX className="text-xl" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <FiImage className="text-4xl text-gray-400 mb-3" />
                    <p className="text-gray-500 font-medium text-sm">Click to upload image from device</p>
                  </>
                )}
              </div>

              {/* Title & Content Inputs */}
              <input 
                type="text"
                placeholder="Give your action a short title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-[#4ADE80] bg-gray-50"
                disabled={isSubmitting}
              />
              <textarea 
                placeholder="Tell your Sustainability Story..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-4 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-[#4ADE80] bg-gray-50"
                disabled={isSubmitting}
              />

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold transition ${isSubmitting ? 'bg-green-300 cursor-wait' : 'bg-[#4ADE80] hover:bg-green-500'}`}
                >
                  {isSubmitting ? <><FiCpu className="animate-pulse" /> AI is Analyzing...</> : 'Analyze Impact'}
                </button>
              </div>
            </div>

          ) : (

            /* ================= STATE 2: POSTSCORE BY AI RESULTS ================= */
            <div className="bg-white w-full max-w-5xl p-8 rounded-[12px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] h-fit">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-[#4ADE80]">PostScore by AI</h2>
                <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-800 flex items-center gap-2 font-medium transition">
                  Go to Feed <FiArrowLeft className="rotate-180" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Column - Post Preview */}
                <div className="md:col-span-2 flex flex-col gap-4">
                  {/* Dynamic Image Rendering! */}
                  {postResult.image_url && (
                    <div className="w-full h-80 bg-gray-100 rounded-xl overflow-hidden relative flex items-center justify-center">
                      <img 
                        src={postResult.image_url} 
                        alt="Action proof" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="border border-gray-200 rounded-xl p-5 bg-white">
                    <h3 className="font-bold text-lg mb-2 text-gray-800">{postResult.title}</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{postResult.content}</p>
                    <div className="mt-4 text-[#4ADE80] font-medium text-sm">
                      #SDG{postResult.sdg_tag} #{getSDGName(postResult.sdg_tag).replace(/\s+/g, '')} #PulseImpact
                    </div>
                  </div>
                </div>

                {/* Right Column - AI Widgets */}
                <div className="md:col-span-1 flex flex-col gap-4">
                  <div className="border border-gray-200 rounded-xl p-6 bg-white flex flex-col justify-center min-h-[140px]">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Most Likely</span>
                    <h3 className="text-2xl font-extrabold text-[#4ADE80] leading-tight">
                      SDG-{postResult.sdg_tag}<br/>{getSDGName(postResult.sdg_tag)}
                    </h3>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6 bg-white flex flex-col items-center justify-center min-h-[220px]">
                    <ScoreGauge score={postResult.impact_score} />
                    <div className="mt-6 w-full text-center border-t border-gray-100 pt-4">
                      <p className="text-xs text-gray-500 font-medium">Community Selected:</p>
                      <p className="text-sm font-bold text-gray-700">{postResult.comm_id?.name || 'Global SDG Pool'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
  );
};

export default CreatePost;