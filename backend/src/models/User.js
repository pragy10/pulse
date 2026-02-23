import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    minlength: [3, 'Username must be at least 3 characters'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password_hash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  // Add these to your userSchema in User.js
  followers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  following: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  // Added for the Profile View
  title: { type: String, default: 'Environment Lover' }, 
  gender: { type: String, default: 'Not specified' },
  location: { type: String, default: 'Global' },
  phone: { type: String, default: '' },
  birthday: { type: String, default: '' },
  bio: { type: String, maxlength: 500, default: '' },
  avatar: { type: String, default: '' },
  green_karma: { type: Number, default: 0 },
  banner: { type: String, default: '' }, // For Base64 Banner
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  created_at: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('User', userSchema);