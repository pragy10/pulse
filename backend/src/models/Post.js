import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comm_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: 300,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: 5000
  },
  image_url: {
    type: String,
    default: ''
  },
  sdg_tag: {
    type: Number,
    min: 1,
    max: 17,
    default: null
  },
  impact_score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  classification_confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  vote_count: {
    type: Number,
    default: 0
  },
  comment_count: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'published', 'removed'],
    default: 'pending'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
postSchema.index({ comm_id: 1, created_at: -1 });
postSchema.index({ user_id: 1 });
postSchema.index({ sdg_tag: 1 });

export default mongoose.model('Post', postSchema);
