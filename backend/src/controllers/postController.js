import Post from "../models/Post.js";
import Community from "../models/Community.js";
import User from "../models/User.js";
import { classifyPost } from "../services/aiService.js";
import {
  calculateImpactScore,
  updateUserKarma,
} from "../services/impactScoreService.js";
import { getImageUrl } from "../services/uploadService.js";

export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user._id;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Please provide title and content",
      });
    }

    let imageUrl = "";
    if (req.file) {
      imageUrl = getImageUrl(req.file);
    }

    const classification = await classifyPost(title, content, imageUrl);

    let sdg_tag = 13;
    let impactScore = 10;
    let confidence = 0;

    if (classification.success && classification.sdg_tag) {
      sdg_tag = classification.sdg_tag;
      confidence = classification.confidence;
      impactScore = calculateImpactScore(
        classification.sdg_tag,
        classification.confidence,
        0,
      );
    }

    const community = await Community.findOne({ sdg_number: sdg_tag });
    if (!community) {
      return res
        .status(500)
        .json({
          success: false,
          message: "System error: SDG Community not found",
        });
    }

    const post = await Post.create({
      user_id: userId,
      comm_id: community._id,
      title,
      content,
      image_url: imageUrl,
      sdg_tag: sdg_tag,
      impact_score: impactScore,
      classification_confidence: confidence,
      status: "published",
    });

    await updateUserKarma(userId, impactScore);
    await Community.findByIdAndUpdate(community._id, {
      $inc: { post_count: 1 },
    });

    await post.populate("user_id", "username avatar green_karma");
    await post.populate("comm_id", "name sdg_number moderators");

    res.status(201).json({
      success: true,
      message: "Post classified and created successfully!",
      data: post,
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ success: false, message: "Error creating post" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const {
      comm_id,
      sdg_tag,
      user,
      sort = "new",
      page = 1,
      limit = 20,
    } = req.query;

    const query = { status: "published" };
    if (comm_id) query.comm_id = comm_id;
    if (sdg_tag) query.sdg_tag = parseInt(sdg_tag);

    if (user) query.user_id = user;

    // Inside getPosts, find your sorting switch statement and update it:
    let sortOption = {};
    switch (sort) {
      case 'hot':
        sortOption = { isPinned: -1, vote_count: -1, created_at: -1 };
        break;
      case 'top':
        sortOption = { isPinned: -1, vote_count: -1 };
        break;
      case 'new':
      default:
        // Pinned posts first (-1), then newest first (-1)
        sortOption = { isPinned: -1, created_at: -1 }; 
    }

    const skip = (page - 1) * limit;

    const posts = await Post.find(query)
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip(skip)
      .populate("user_id", "username avatar green_karma")
      .populate("comm_id", "name sdg_number moderators");

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user_id", "username avatar green_karma role")
      .populate("comm_id", "name description sdg_number moderators");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching post",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    if (post.user_id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to edit this post" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    await post.save();

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ success: false, message: "Error updating post" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("comm_id");
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    // Inside deletePost:
    const isOwner = post.user_id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    // NEW: Check if the user's ID is in the community's moderator array
    const isCommunityMod = post.comm_id.moderators.some(
      (modId) => modId.toString() === req.user._id.toString(),
    );

    if (!isOwner && !isAdmin && !isCommunityMod) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not authorized to moderate this community",
        });
    }

    post.status = "removed";
    await post.save();
    res.status(200).json({ success: true, message: "Post removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Pin or Unpin a post
// @route   PUT /api/posts/:id/pin
// @access  Private (Community Moderator or Admin)
export const pinPost = async (req, res) => {
  try {
    // 1. Fetch the post and populate the community details so we can see the moderators array
    const post = await Post.findById(req.params.id).populate('comm_id');
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // 2. Check permissions
    const isAdmin = req.user.role === 'admin';
    // Check if the logged-in user's ID exists inside this specific community's moderators list
    const isCommunityMod = post.comm_id.moderators.some(
      (modId) => modId.toString() === req.user._id.toString()
    );

    // 3. Block if they aren't authorized
    if (!isAdmin && !isCommunityMod) {
      return res.status(403).json({ success: false, message: 'Only community moderators can pin posts' });
    }

    // 4. Toggle the pin status and save
    post.isPinned = !post.isPinned;
    await post.save();

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
