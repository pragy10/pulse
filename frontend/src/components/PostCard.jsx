import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  FiArrowUp, FiArrowDown, FiMessageCircle, FiSend, FiX, 
  FiMoreVertical, FiEdit2, FiTrash2, FiMapPin 
} from 'react-icons/fi';

// Updated ThreadedComment to support moderator deletion
const ThreadedComment = ({ comment, depth = 0, onReply, onDelete, currentUser }) => {
  const isCommentOwner = currentUser?._id === comment.user_id?._id || currentUser?.id === comment.user_id?._id;
  const isModerator = currentUser?.role === 'moderator' || currentUser?.role === 'admin';

  return (
    <div className={`relative ${depth > 0 ? 'ml-10 mt-3' : 'mt-4'}`}>
      {depth > 0 && <div className="absolute -top-10 -left-6 w-5 h-14 border-l-2 border-b-2 border-gray-100 rounded-bl-xl pointer-events-none" />}
      <div className="flex gap-3">
        <img src={comment.user_id?.avatar || `https://ui-avatars.com/api/?name=${comment.user_id?.username}`} className="w-8 h-8 rounded-full z-10 bg-white object-cover" alt="user" />
        <div className="flex-1">
          <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none border border-gray-100 relative group">
            <span className="font-bold text-[#FF6B6B] text-xs block mb-1">{comment.user_id?.username}</span>
            <p className="text-sm text-gray-700 leading-relaxed">{comment.text}</p>
            
            {/* Moderator/Owner Delete Button for Comments */}
            {(isCommentOwner || isModerator) && (
              <button 
                onClick={() => onDelete(comment._id)}
                className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FiX size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-4 mt-1 ml-2 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
            <button className="hover:text-gray-600 transition">Like</button>
            <button onClick={() => onReply(comment)} className="hover:text-[#4ADE80] transition">Reply</button>
          </div>
        </div>
      </div>
      {comment.replies?.map(reply => (
        <ThreadedComment 
          key={reply._id} 
          comment={reply} 
          depth={depth + 1} 
          onReply={onReply} 
          onDelete={onDelete}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  
  const authId = user?._id || user?.id;
  const authorId = post.user_id?._id || post.user_id;
  const isOwner = authId === authorId;
  const isModerator = user?.role === 'moderator' || user?.role === 'admin';

  const [votes, setVotes] = useState(post.vote_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [userVote, setUserVote] = useState(0);

  const [isDeleted, setIsDeleted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: post.title, content: post.content });
  const [currentPost, setCurrentPost] = useState(post);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/posts/${post._id}/comments`);
      if (res.data.success) setComments(res.data.data);
    } catch (err) { console.error(err); }
  };

  const handleUserClick = (e) => {
    e.stopPropagation();
    if (authorId) navigate(`/profile/${authorId}`);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    try {
      const res = await api.post(`/posts/${post._id}/comments`, { text: inputText, parent_comment_id: replyingTo?._id || null });
      if (res.data.success) {
        setInputText(''); setReplyingTo(null); fetchComments();
      }
    } catch (err) { console.error(err); }
  };

  const handleCommentDelete = async (commentId) => {
    if (window.confirm("Delete this comment?")) {
      try {
        const res = await api.delete(`/comments/${commentId}`);
        if (res.data.success) fetchComments();
      } catch (err) { alert("Failed to delete comment"); }
    }
  };

  useEffect(() => {
    const fetchMyVote = async () => {
      try {
        const res = await api.get(`/posts/${post._id}/vote`);
        if (res.data.success && res.data.data) setUserVote(res.data.data.vote_type);
      } catch (err) { console.error(err); }
    };
    fetchMyVote();
  }, [post._id]);

  const handleVote = async (type) => {
    try {
      const res = await api.post(`/posts/${post._id}/vote`, { vote_type: type });
      if (res.data.success) {
        if (res.data.action === 'created') { setVotes(prev => prev + type); setUserVote(type); } 
        else if (res.data.action === 'removed') { setVotes(prev => prev - type); setUserVote(0); } 
        else if (res.data.action === 'updated') { setVotes(prev => prev + (type * 2)); setUserVote(type); }
      }
    } catch (err) { console.error("Vote failed", err); }
  };

  const handleUpdate = async () => {
    try {
      const res = await api.put(`/posts/${post._id}`, editData);
      if (res.data.success) {
        setCurrentPost({ ...currentPost, title: editData.title, content: editData.content });
        setIsEditing(false);
        setShowDropdown(false);
      }
    } catch (err) { alert("Failed to update post"); }
  };

  const handleDelete = async () => {
    const message = isModerator && !isOwner 
      ? "MODERATOR ACTION: Delete this post permanently?" 
      : "Are you sure you want to delete this post?";
    
    if (window.confirm(message)) {
      try {
        const res = await api.delete(`/posts/${post._id}`);
        if (res.data.success) setIsDeleted(true);
      } catch (err) { alert("Failed to delete post"); }
    }
  };

  const handlePin = async () => {
    try {
      const res = await api.put(`/posts/${post._id}/pin`);
      if (res.data.success) {
        setCurrentPost({ ...currentPost, isPinned: res.data.data.isPinned });
        setShowDropdown(false);
      }
    } catch (err) { alert("Failed to pin post"); }
  };

  if (isDeleted) return null;

  return (
    <div className={`bg-white p-5 rounded-2xl shadow-sm border mb-6 transition-all relative ${currentPost.isPinned ? 'border-[#4ADE80] ring-1 ring-[#4ADE80]/20' : 'border-gray-100'}`}>
      
      {/* Pinned Badge */}
      {currentPost.isPinned && (
        <div className="flex items-center gap-1 text-[10px] font-bold text-[#4ADE80] uppercase tracking-widest mb-2">
          <FiMapPin size={12} /> Pinned by Moderator
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleUserClick}>
          <img src={currentPost.user_id?.avatar || `https://ui-avatars.com/api/?name=${currentPost.user_id?.username}`} className="w-12 h-12 rounded-full object-cover" alt="User" />
          <div className="text-sm">
            <span className="font-bold text-gray-800">{currentPost.user_id?.username || 'Pulse User'}</span>
            <span className="text-gray-400 mx-2">▸</span>
            <span className="font-bold text-[#4ADE80]">{currentPost.comm_id?.name || 'General'}</span>
            <p className="text-[10px] text-gray-400 mt-0.5">{new Date(currentPost.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* MODERATOR / OWNER OPTIONS */}
        {(isOwner || isModerator) && (
          <div className="relative">
            <button onClick={() => setShowDropdown(!showDropdown)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition">
              <FiMoreVertical />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                {isOwner && (
                  <button 
                    onClick={() => { setIsEditing(true); setShowDropdown(false); }} 
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FiEdit2 className="text-gray-400"/> Edit Post
                  </button>
                )}
                {isModerator && (
                  <button 
                    onClick={handlePin} 
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FiMapPin className={currentPost.isPinned ? 'text-[#4ADE80]' : 'text-gray-400'}/> 
                    {currentPost.isPinned ? 'Unpin Post' : 'Pin Post'}
                  </button>
                )}
                <button 
                  onClick={handleDelete} 
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <FiTrash2 className="text-red-400"/> {isModerator && !isOwner ? 'Remove Post' : 'Delete Post'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="mb-4 space-y-3">
          <input 
            type="text" 
            value={editData.title} 
            onChange={(e) => setEditData({...editData, title: e.target.value})}
            className="w-full font-bold text-gray-900 mb-2 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ADE80]"
          />
          <textarea 
            value={editData.content} 
            onChange={(e) => setEditData({...editData, content: e.target.value})}
            className="w-full text-gray-700 text-sm leading-relaxed p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4ADE80] min-h-[100px]"
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition">Cancel</button>
            <button onClick={handleUpdate} className="px-4 py-2 text-sm bg-[#4ADE80] text-white font-bold rounded-lg hover:bg-green-500 transition">Save Changes</button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="font-bold text-gray-900 mb-2">{currentPost.title}</h3>
          <p className="text-gray-700 text-sm mb-4 leading-relaxed whitespace-pre-wrap">{currentPost.content}</p>
        </>
      )}

      {currentPost.image_url && (
        <div className="rounded-xl overflow-hidden mb-4 border border-gray-100">
          <img src={currentPost.image_url} alt="Action proof" className="w-full h-auto max-h-[400px] object-cover" />
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-4">
        <div className="flex items-center bg-gray-50 rounded-full px-1 border border-gray-200">
          <button onClick={() => handleVote(1)} className={`p-2 rounded-full transition ${userVote === 1 ? 'bg-green-100 text-[#4ADE80]' : 'text-gray-500 hover:text-[#4ADE80] hover:bg-green-50'}`}>
            <FiArrowUp className="text-lg" />
          </button>
          <span className={`font-bold text-sm px-2 ${userVote === 1 ? 'text-[#4ADE80]' : userVote === -1 ? 'text-red-400' : 'text-gray-700'}`}>{votes}</span>
          <button onClick={() => handleVote(-1)} className={`p-2 rounded-full transition ${userVote === -1 ? 'text-red-400 bg-red-100' : 'text-gray-500 hover:text-red-400 hover:bg-red-50'}`}>
            <FiArrowDown className="text-lg" />
          </button>
        </div>

        <button onClick={() => { if(!showComments) fetchComments(); setShowComments(!showComments); }} className="flex items-center gap-2 text-sm text-gray-500 font-semibold hover:text-[#4ADE80] transition">
          <FiMessageCircle /> <span>{currentPost.comment_count || 0} Comments</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-[#FF6B6B] font-bold text-xs uppercase tracking-widest mb-4">Comments</h4>
          <form onSubmit={handleCommentSubmit} className="mb-6">
            {replyingTo && (
              <div className="flex justify-between items-center bg-blue-50 px-3 py-1 rounded-t-xl border-x border-t border-blue-100">
                <span className="text-[10px] font-bold text-blue-500 uppercase">Replying to {replyingTo.user_id?.username}</span>
                <button type="button" onClick={() => setReplyingTo(null)} className="text-blue-500"><FiX size={12} /></button>
              </div>
            )}
            <div className="flex gap-2">
              <input type="text" placeholder={replyingTo ? "Write a reply..." : "Add a comment..."} className={`flex-1 bg-gray-50 border border-gray-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4ADE80] ${replyingTo ? 'rounded-b-xl' : 'rounded-xl'}`} value={inputText} onChange={(e) => setInputText(e.target.value)} />
              <button type="submit" className="bg-[#4ADE80] text-white px-4 py-2 rounded-xl"><FiSend /></button>
            </div>
          </form>
          <div className="space-y-4">
            {comments.map(c => (
              <ThreadedComment 
                key={c._id} 
                comment={c} 
                onReply={setReplyingTo} 
                onDelete={handleCommentDelete}
                currentUser={user}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;