// backend/src/routes/users.js
import express from 'express';
// ADD 'getUserById' TO THE LIST BELOW:
import { getProfile, updateProfile, getSuggestedUsers, getUserById, followUser, getLeaderboard, changePassword, deleteAccount, requestModerator } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Profile Routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Sidebar Suggestions
router.get('/suggestions', protect, getSuggestedUsers);
router.get('/leaderboard', protect, getLeaderboard);

router.put('/change-password', protect, changePassword);
router.post('/request-mod', protect, requestModerator);
router.delete('/delete-account', protect, deleteAccount);

// Public Profile Route
router.get('/:id', protect, getUserById); 

router.post('/:id/follow', protect, followUser);

export default router;