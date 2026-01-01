import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema({
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
  joined_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure one membership per user per community
membershipSchema.index({ user_id: 1, comm_id: 1 }, { unique: true });

export default mongoose.model('Membership', membershipSchema);
