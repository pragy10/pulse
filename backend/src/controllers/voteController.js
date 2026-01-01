import Vote from '../models/Vote.js';
import Post from '../models/Post.js';

// @desc    Vote on a post (upvote or downvote)
// @route   POST /api/posts/:postId/vote
// @access  Private
export const votePost = async (req, res) => {
  try {
    const { vote_type } = req.body; // 1 for upvote, -1 for downvote
    const postId = req.params.postId;
    const userId = req.user._id;

    // Validate vote type
    if (vote_type !== 1 && vote_type !== -1) {
      return res.status(400).json({
        success: false,
        message: 'Vote type must be 1 (upvote) or -1 (downvote)'
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

    // Check if user already voted
    const existingVote = await Vote.findOne({
      user_id: userId,
      post_id: postId
    });

    if (existingVote) {
      // User is changing their vote
      if (existingVote.vote_type === vote_type) {
        // Same vote - remove it (toggle off)
        await existingVote.deleteOne();
        
        // Update post vote count
        await Post.findByIdAndUpdate(postId, {
          $inc: { vote_count: -vote_type }
        });

        return res.status(200).json({
          success: true,
          message: 'Vote removed',
          action: 'removed'
        });
      } else {
        // Different vote - update it
        const voteChange = vote_type - existingVote.vote_type; // Will be +2 or -2
        existingVote.vote_type = vote_type;
        await existingVote.save();

        // Update post vote count
        await Post.findByIdAndUpdate(postId, {
          $inc: { vote_count: voteChange }
        });

        return res.status(200).json({
          success: true,
          message: 'Vote updated',
          action: 'updated',
          vote_type
        });
      }
    } else {
      // New vote
      await Vote.create({
        user_id: userId,
        post_id: postId,
        vote_type
      });

      // Update post vote count
      await Post.findByIdAndUpdate(postId, {
        $inc: { vote_count: vote_type }
      });

      res.status(201).json({
        success: true,
        message: 'Vote recorded',
        action: 'created',
        vote_type
      });
    }
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording vote',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user's vote on a post
// @route   GET /api/posts/:postId/vote
// @access  Private
export const getUserVote = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    const vote = await Vote.findOne({
      user_id: userId,
      post_id: postId
    });

    if (!vote) {
      return res.status(200).json({
        success: true,
        data: null
      });
    }

    res.status(200).json({
      success: true,
      data: {
        vote_type: vote.vote_type,
        voted_at: vote.voted_at
      }
    });
  } catch (error) {
    console.error('Get vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vote',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
