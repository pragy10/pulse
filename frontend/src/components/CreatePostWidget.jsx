import React, { useState } from 'react';
import api from '../services/api';
import { FiImage, FiCpu } from 'react-icons/fi';

const CreatePostWidget = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Please fill in what you did!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Notice: We no longer send comm_id!
      const response = await api.post('/posts', { title, content });

      if (response.data.success) {
        setTitle('');
        setContent('');
        onPostCreated(); // Refresh feed
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 border-t-4 border-[#4ADE80]">
      <div className="flex gap-3 mb-4">
        <img 
          src="https://ui-avatars.com/api/?name=User&background=random" 
          alt="Current User" 
          className="w-10 h-10 rounded-full object-cover" 
        />
        <input
          type="text"
          placeholder="Title of your sustainable action..."
          className="w-full bg-gray-50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ADE80] border border-transparent transition"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      
      <textarea
        placeholder="Describe what you did! The Pulse AI will automatically classify it into the correct SDG community..."
        className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ADE80] border border-transparent transition resize-none min-h-[80px] mb-3"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-gray-100 pt-3">
        <button type="button" className="p-2 text-gray-400 hover:text-[#4ADE80] hover:bg-green-50 rounded-full transition">
          <FiImage className="text-lg" />
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white transition-all w-full sm:w-auto justify-center ${
            isSubmitting ? 'bg-green-300 cursor-wait' : 'bg-[#4ADE80] hover:bg-green-500 shadow-md shadow-green-200'
          }`}
        >
          {isSubmitting ? (
            <><FiCpu className="animate-pulse" /> AI is classifying...</>
          ) : (
            'Post Action'
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePostWidget;