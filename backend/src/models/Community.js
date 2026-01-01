import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 500,
    required: true
  },
  sdg_number: {
    type: Number,
    min: 1,
    max: 17,
    required: true
  },
  member_count: {
    type: Number,
    default: 0
  },
  post_count: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Community', communitySchema);
