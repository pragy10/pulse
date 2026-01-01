import express from 'express';
import { createPost, getPosts, getPostById, deletePost } from '../controllers/postController.js';
import { votePost, getUserVote } from '../controllers/voteController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../services/uploadService.js';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/:id', getPostById);

// Protected routes
router.post('/', protect, upload.single('image'), createPost);
router.delete('/:id', protect, deletePost);

// Voting routes
router.post('/:postId/vote', protect, votePost);
router.get('/:postId/vote', protect, getUserVote);

export default router;
