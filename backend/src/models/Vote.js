import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  vote_type: {
    type: Number,
    enum: [1, -1], // 1 for upvote, -1 for downvote
    required: true
  },
  voted_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure one vote per user per post
voteSchema.index({ user_id: 1, post_id: 1 }, { unique: true });

export default mongoose.model('Vote', voteSchema);
