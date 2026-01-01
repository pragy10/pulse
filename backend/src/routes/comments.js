import express from 'express';
import { addComment, getComments, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Comment routes (nested under posts)
router.post('/:postId/comments', protect, addComment);
router.get('/:postId/comments', getComments);
router.delete('/comments/:id', protect, deleteComment);

export default router;
