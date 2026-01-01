import Post from '../models/Post.js';
import Community from '../models/Community.js';
import User from '../models/User.js';
import { classifyPost } from '../services/aiService.js';
import { calculateImpactScore, updateUserKarma } from '../services/impactScoreService.js';
import { getImageUrl } from '../services/uploadService.js';

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    const { title, content, comm_id } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!title || !content || !comm_id) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, content, and community'
      });
    }

    // Check if community exists
    const community = await Community.findById(comm_id);
    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Handle image upload
    let imageUrl = '';
    if (req.file) {
      imageUrl = getImageUrl(req.file.filename);
    }

    // Create post with pending status
    const post = await Post.create({
      user_id: userId,
      comm_id,
      title,
      content,
      image_url: imageUrl,
      status: 'pending'
    });

    // Call AI service for classification (async, don't wait)
    classifyPost(title, content, imageUrl)
      .then(async (classification) => {
        if (classification.success && classification.sdg_tag) {
          const impactScore = calculateImpactScore(
            classification.sdg_tag,
            classification.confidence
          );

          // Update post with AI results
          post.sdg_tag = classification.sdg_tag;
          post.impact_score = impactScore;
          post.classification_confidence = classification.confidence;
          post.status = 'published';
          await post.save();

          // Update user's karma
          await updateUserKarma(userId, impactScore);

          // Update community post count
          await Community.findByIdAndUpdate(comm_id, {
            $inc: { post_count: 1 }
          });
        } else {
          // If AI fails, mark as published with default values
          post.status = 'published';
          post.sdg_tag = community.sdg_number; // Use community's SDG
          post.impact_score = 10; // Default score
          await post.save();
          
          await updateUserKarma(userId, 10);
          await Community.findByIdAndUpdate(comm_id, {
            $inc: { post_count: 1 }
          });
        }
      })
      .catch(async (error) => {
        console.error('Classification error:', error);
        // Fallback: publish with default values
        post.status = 'published';
        post.sdg_tag = community.sdg_number;
        post.impact_score = 10;
        await post.save();
      });

    res.status(201).json({
      success: true,
      message: 'Post created successfully. Classification in progress...',
      data: post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all posts (with filters)
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
  try {
    const { comm_id, sdg_tag, sort = 'new', page = 1, limit = 20 } = req.query;

    // Build query
    const query = { status: 'published' };
    if (comm_id) query.comm_id = comm_id;
    if (sdg_tag) query.sdg_tag = parseInt(sdg_tag);

    // Sorting options
    let sortOption = {};
    switch (sort) {
      case 'hot':
        sortOption = { vote_count: -1, created_at: -1 };
        break;
      case 'top':
        sortOption = { vote_count: -1 };
        break;
      case 'new':
      default:
        sortOption = { created_at: -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const posts = await Post.find(query)
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('user_id', 'username avatar green_karma')
      .populate('comm_id', 'name sdg_number');

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user_id', 'username avatar green_karma role')
      .populate('comm_id', 'name description sdg_number');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Owner, Moderator, Admin)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check authorization
    const isOwner = post.user_id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isModerator = req.user.role === 'moderator';

    if (!isOwner && !isAdmin && !isModerator) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    // Soft delete
    post.status = 'removed';
    await post.save();

    // Decrement community post count
    await Community.findByIdAndUpdate(post.comm_id, {
      $inc: { post_count: -1 }
    });

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
