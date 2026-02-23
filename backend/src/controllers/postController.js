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
    const { title, content } = req.body;
    const userId = req.user._id;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and content'
      });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = getImageUrl(req.file); // Returns a Base64 string
    }

    // 🛑 1. THE WAITING PHASE: Node.js stops here and waits for Python!
    const classification = await classifyPost(title, content, imageUrl);
    
    // Set fallback values just in case the AI is down
    let sdg_tag = 13; 
    let impactScore = 10;
    let confidence = 0;

    // If Python succeeded, grab the real scores
    if (classification.success && classification.sdg_tag) {
      sdg_tag = classification.sdg_tag;
      confidence = classification.confidence;
      impactScore = calculateImpactScore(classification.sdg_tag, classification.confidence, 0);
    }

    // 🔍 2. THE ROUTING PHASE: Find the matching community
    const community = await Community.findOne({ sdg_number: sdg_tag });
    if (!community) {
      return res.status(500).json({ success: false, message: 'System error: SDG Community not found' });
    }

    // 💾 3. THE SAVING PHASE: Save to the database
    const post = await Post.create({
      user_id: userId,
      comm_id: community._id, 
      title,
      content,
      image_url: imageUrl,
      sdg_tag: sdg_tag,
      impact_score: impactScore,
      classification_confidence: confidence,
      status: 'published' // It skips 'pending' entirely now!
    });

    // Update karma and counts
    await updateUserKarma(userId, impactScore);
    await Community.findByIdAndUpdate(community._id, { $inc: { post_count: 1 } });

    // Populate user and community data for the React frontend
    await post.populate('user_id', 'username avatar green_karma');
    await post.populate('comm_id', 'name sdg_number');

    // 🚀 4. THE RESPONSE PHASE: Tell React we are done!
    res.status(201).json({
      success: true,
      message: 'Post classified and created successfully!',
      data: post
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ success: false, message: 'Error creating post' });
  }
};

// @desc    Get all posts (with filters)
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
  try {
    // FIXED: Added 'user' to the destructured query variables
    const { comm_id, sdg_tag, user, sort = 'new', page = 1, limit = 20 } = req.query;

    // Build query
    const query = { status: 'published' };
    if (comm_id) query.comm_id = comm_id;
    if (sdg_tag) query.sdg_tag = parseInt(sdg_tag);
    
    // FIXED: If the frontend sends ?user=ID, add it to the database search query
    if (user) query.user_id = user;

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

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check authorization: Only the owner can edit
    if (post.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this post' });
    }

    // Update the fields
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    
    await post.save();

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ success: false, message: 'Error updating post' });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (Owner, Moderator, Admin)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('comm_id');
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const isOwner = post.user_id.toString() === req.user._id.toString();
    const isGlobalAdmin = req.user.role === 'admin';
    // NEW: Check if user is a moderator of THIS specific community
    const isCommunityMod = post.comm_id.moderators.includes(req.user._id);

    if (!isOwner && !isGlobalAdmin && !isCommunityMod) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    post.status = 'removed';
    await post.save();
    res.status(200).json({ success: true, message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const pinPost = async (req, res) => {
  try {
    if (req.user.role !== 'moderator' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only moderators can pin posts' });
    }

    const post = await Post.findById(req.params.id);
    // Toggle the pin status (you'll need to add 'isPinned' to your Post.js model)
    post.isPinned = !post.isPinned;
    await post.save();

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};