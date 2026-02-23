import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PostCard from "../components/PostCard";
import {
  FiHome,
  FiUser,
  FiCompass,
  FiSettings,
  FiBell,
  FiMessageSquare,
  FiChevronDown,
  FiPlus,
  FiEdit3,
} from "react-icons/fi";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        if (response.data.success) {
          setPosts(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div
        onClick={() => navigate("/post")}
        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group"
      >
        <img
          src="https://ui-avatars.com/api/?name=Pragya+Sekar"
          alt="User"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="bg-gray-50 flex-1 rounded-xl px-4 py-3 text-sm text-gray-500 group-hover:bg-gray-100 transition">
          Share your sustainable action with the world...
        </div>
        <div className="bg-[#4ADE80] text-white p-3 rounded-xl shadow-sm shadow-green-200 group-hover:bg-green-500 transition">
          <FiPlus className="text-xl" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 font-semibold animate-pulse">
          Loading Pulse Feed...
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500">
            No sustainable actions posted yet. Be the first!
          </p>
        </div>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      )}
    </div>
  );
};

export default Home;
