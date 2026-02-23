import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true }, // Changed from content
  parent_comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // Changed from parent_id
  likes: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);