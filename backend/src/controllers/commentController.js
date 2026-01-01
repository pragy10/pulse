import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// @desc    Add comment to post
// @route   POST /api/posts/:postId/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text, parent_comment_id } = req.body;
    const postId = req.params.postId;
    const userId = req.user._id;

    // Validate input
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // If replying to a comment, check if parent exists
    if (parent_comment_id) {
      const parentComment = await Comment.findById(parent_comment_id);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found'
        });
      }
    }

    // Create comment
    const comment = await Comment.create({
      post_id: postId,
      user_id: userId,
      parent_comment_id: parent_comment_id || null,
      text: text.trim()
    });

    // Increment post comment count
    await Post.findByIdAndUpdate(postId, {
      $inc: { comment_count: 1 }
    });

    // Populate user details
    await comment.populate('user_id', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Public
export const getComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { sort = 'new' } = req.query;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Sorting options
    let sortOption = {};
    if (sort === 'old') {
      sortOption = { created_at: 1 };
    } else {
      sortOption = { created_at: -1 }; // default: newest first
    }

    // Get all comments for this post
    const comments = await Comment.find({ post_id: postId })
      .sort(sortOption)
      .populate('user_id', 'username avatar green_karma role');

    // Organize into threads (parent comments with their replies)
    const parentComments = comments.filter(c => !c.parent_comment_id);
    const childComments = comments.filter(c => c.parent_comment_id);

    // Attach replies to parent comments
    const threaded = parentComments.map(parent => {
      const replies = childComments.filter(
        child => child.parent_comment_id.toString() === parent._id.toString()
      );
      return {
        ...parent.toObject(),
        replies
      };
    });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: threaded
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (Owner, Moderator, Admin)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check authorization
    const isOwner = comment.user_id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isModerator = req.user.role === 'moderator';

    if (!isOwner && !isAdmin && !isModerator) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await comment.deleteOne();

    // Decrement post comment count
    await Post.findByIdAndUpdate(comment.post_id, {
      $inc: { comment_count: -1 }
    });

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
