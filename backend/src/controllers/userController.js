
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Post from '../models/Post.js';

export const deleteAccount = async (req, res) => {
  try {
    // 1. Remove user's posts (Optional: or mark as 'removed')
    await Post.deleteMany({ user_id: req.user._id });
    
    // 2. Delete the user
    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({ success: true, message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const requestModerator = async (req, res) => {
  try {
    // In a full app, this would create a 'Request' document. 
    // For now, we'll tag the user as 'pending_mod' or add a note.
    await User.findByIdAndUpdate(req.user._id, { title: 'Moderator Applicant' });
    res.status(200).json({ success: true, message: 'Application submitted to admins' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password_hash');

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password_hash');
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
// backend/src/controllers/userController.js

export const updateProfile = async (req, res) => {
  try {
    // ADD firstName and lastName to this list
    const { firstName, lastName, username, title, gender, location, phone, birthday, avatar, banner } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      // ADD them to the update object
      { firstName, lastName, username, title, gender, location, phone, birthday, avatar, banner },
      { new: true, runValidators: true }
    ).select('-password_hash');

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Follow or Unfollow a user
// @route   POST /api/users/:id/follow
// @access  Private
export const followUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (targetUser._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
    }

    // Check if already following
    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
      // Unfollow logic
      await User.findByIdAndUpdate(currentUser._id, { $pull: { following: targetUser._id } });
      await User.findByIdAndUpdate(targetUser._id, { $pull: { followers: currentUser._id } });
      
      res.status(200).json({ success: true, message: 'Unfollowed successfully', isFollowing: false });
    } else {
      // Follow logic
      await User.findByIdAndUpdate(currentUser._id, { $addToSet: { following: targetUser._id } });
      await User.findByIdAndUpdate(targetUser._id, { $addToSet: { followers: currentUser._id } });
      
      res.status(200).json({ success: true, message: 'Followed successfully', isFollowing: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADD THIS: New controller to view ANY user's profile by ID
// backend/src/controllers/userController.js

// ENSURE 'export' IS PRESENT AT THE START:
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password_hash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
};
// @desc    Get suggested users for Right Sidebar
// @route   GET /api/users/suggestions
// @access  Private
export const getSuggestedUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('username avatar title role')
      .limit(4);

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching suggestions' });
  }
};


// @desc    Get top users by Green Karma
// @route   GET /api/users/leaderboard
// @access  Private
export const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find({})
      .select('firstName lastName username avatar green_karma title')
      .sort({ green_karma: -1 }) // Sort by highest karma
      .limit(10); // Get top 10

    res.status(200).json({ success: true, data: topUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching leaderboard' });
  }
};