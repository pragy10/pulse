import express from 'express';
import {
  getCommunities,
  getCommunity,
  initializeCommunities,
  joinCommunity,
  leaveCommunity,
  getMyMemberships
} from '../controllers/communityController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getCommunities);
router.get('/:id', getCommunity);

// Protected routes
router.get('/my/memberships', protect, getMyMemberships);
router.post('/:id/join', protect, joinCommunity);
router.post('/:id/leave', protect, leaveCommunity);

// Admin only
router.post('/init', protect, authorize('admin'), initializeCommunities);

export default router;
