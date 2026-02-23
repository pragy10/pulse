import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PostCard from '../components/PostCard';

const CommunityView = () => {
  const { id } = useParams(); // Get the SDG number from URL
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityPosts = async () => {
      try {
        // You might need an endpoint like /api/posts/community/:id 
        // Or filter the /api/posts result on the frontend
        const res = await api.get('/posts'); 
        if (res.data.success) {
          const filtered = res.data.data.filter(post => post.sdg_tag === parseInt(id));
          setPosts(filtered);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunityPosts();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-20 px-4">
       <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">SDG {id} Community Feed</h2>
          {loading ? <p>Loading...</p> : posts.map(post => <PostCard key={post._id} post={post} />)}
       </div>
    </div>
  );
};

export default CommunityView;