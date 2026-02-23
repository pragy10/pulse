import User from '../models/User.js';
import SystemConfig from '../models/SystemConfig.js';
import Community from '../models/Community.js';

// --- USER MANAGEMENT ---

export const getAllUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    let query = {};

    // Search by username or email
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    // Filter by role
    if (role && role !== 'all') {
      query.role = role;
    }

    const users = await User.find(query).select('-password_hash').sort({ created_at: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password_hash');
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update role' });
  }
};

// --- AI WEIGHT MANAGEMENT ---

export const getSdgWeights = async (req, res) => {
  try {
    let config = await SystemConfig.findOne({ setting_name: 'sdg_weights' });
    
    // If it doesn't exist yet, create the default one based on your Python script
    if (!config) {
      config = await SystemConfig.create({
        setting_name: 'sdg_weights',
        default_weight: 80,
        weights: { "1": 90, "2": 90, "7": 95, "12": 95, "13": 100, "14": 85, "15": 85 }
      });
    }
    res.status(200).json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch weights' });
  }
};

export const updateSdgWeights = async (req, res) => {
  try {
    const { weights, default_weight } = req.body;
    const config = await SystemConfig.findOneAndUpdate(
      { setting_name: 'sdg_weights' },
      { weights, default_weight },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, data: config, message: 'AI Weights updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update weights' });
  }
};

export const getAdminCommunities = async (req, res) => {
  try {
    // Fetch all communities and populate the moderators array with user details
    const communities = await Community.find()
      .populate('moderators', 'username email avatar')
      .sort({ sdg_number: 1 });
    res.status(200).json({ success: true, data: communities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch communities' });
  }
};

export const assignCommunityModerator = async (req, res) => {
  try {
    const { userId } = req.body;
    const community = await Community.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { moderators: userId } }, // $addToSet prevents duplicates
      { new: true }
    ).populate('moderators', 'username email avatar');
    
    res.status(200).json({ success: true, data: community, message: 'Moderator assigned' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to assign moderator' });
  }
};

export const removeCommunityModerator = async (req, res) => {
  try {
    const { userId } = req.params;
    const community = await Community.findByIdAndUpdate(
      req.params.id,
      { $pull: { moderators: userId } }, // $pull removes the ID from the array
      { new: true }
    ).populate('moderators', 'username email avatar');
    
    res.status(200).json({ success: true, data: community, message: 'Moderator removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove moderator' });
  }
};