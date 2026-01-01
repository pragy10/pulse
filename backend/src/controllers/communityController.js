import Community from '../models/Community.js';
import Membership from '../models/Membership.js';
import { SDG_GOALS } from '../config/constants.js';

// @desc    Get all communities
// @route   GET /api/communities
// @access  Public
export const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find().sort({ sdg_number: 1 });

    res.status(200).json({
      success: true,
      count: communities.length,
      data: communities
    });
  } catch (error) {
    console.error('Get communities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching communities',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single community
// @route   GET /api/communities/:id
// @access  Public
export const getCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    res.status(200).json({
      success: true,
      data: community
    });
  } catch (error) {
    console.error('Get community error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching community',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Initialize 17 SDG communities
// @route   POST /api/communities/init
// @access  Private (Admin only)
export const initializeCommunities = async (req, res) => {
  try {
    // Check if communities already exist
    const existingCount = await Community.countDocuments();
    if (existingCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Communities already initialized'
      });
    }

    // Create 17 communities based on SDG goals
    const communities = SDG_GOALS.map(sdg => ({
      name: `SDG ${sdg.id}: ${sdg.name}`,
      description: `Community dedicated to ${sdg.name} - Sustainable Development Goal ${sdg.id}`,
      sdg_number: sdg.id
    }));

    const createdCommunities = await Community.insertMany(communities);

    res.status(201).json({
      success: true,
      message: '17 SDG communities created successfully',
      data: createdCommunities
    });
  } catch (error) {
    console.error('Initialize communities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error initializing communities',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Join a community
// @route   POST /api/communities/:id/join
// @access  Private
export const joinCommunity = async (req, res) => {
  try {
    const communityId = req.params.id;
    const userId = req.user._id;

    // Check if community exists
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check if already a member
    const existingMembership = await Membership.findOne({
      user_id: userId,
      comm_id: communityId
    });

    if (existingMembership) {
      return res.status(400).json({
        success: false,
        message: 'Already a member of this community'
      });
    }

    // Create membership
    await Membership.create({
      user_id: userId,
      comm_id: communityId
    });

    // Increment member count
    await Community.findByIdAndUpdate(communityId, {
      $inc: { member_count: 1 }
    });

    res.status(200).json({
      success: true,
      message: 'Successfully joined community'
    });
  } catch (error) {
    console.error('Join community error:', error);
    res.status(500).json({
      success: false,
      message: 'Error joining community',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Leave a community
// @route   POST /api/communities/:id/leave
// @access  Private
export const leaveCommunity = async (req, res) => {
  try {
    const communityId = req.params.id;
    const userId = req.user._id;

    // Find and delete membership
    const membership = await Membership.findOneAndDelete({
      user_id: userId,
      comm_id: communityId
    });

    if (!membership) {
      return res.status(400).json({
        success: false,
        message: 'Not a member of this community'
      });
    }

    // Decrement member count
    await Community.findByIdAndUpdate(communityId, {
      $inc: { member_count: -1 }
    });

    res.status(200).json({
      success: true,
      message: 'Successfully left community'
    });
  } catch (error) {
    console.error('Leave community error:', error);
    res.status(500).json({
      success: false,
      message: 'Error leaving community',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user's joined communities
// @route   GET /api/communities/my-communities
// @access  Private
export const getMyMemberships = async (req, res) => {
  try {
    const userId = req.user._id;

    const memberships = await Membership.find({ user_id: userId })
      .populate('comm_id');

    const communities = memberships.map(m => m.comm_id);

    res.status(200).json({
      success: true,
      count: communities.length,
      data: communities
    });
  } catch (error) {
    console.error('Get my communities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching memberships',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
