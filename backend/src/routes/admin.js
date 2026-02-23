import express from 'express';
import { 
  getAllUsers, updateUserRole, 
  getSdgWeights, updateSdgWeights,
  // ADD THESE NEW IMPORTS:
  getAdminCommunities, assignCommunityModerator, removeCommunityModerator 
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
router.use(protect, authorize('admin'));

// User routes
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

// Config routes
router.get('/weights', getSdgWeights);
router.put('/weights', updateSdgWeights);

// ADD THESE NEW COMMUNITY MOD ROUTES:
router.get('/communities', getAdminCommunities);
router.post('/communities/:id/moderators', assignCommunityModerator);
router.delete('/communities/:id/moderators/:userId', removeCommunityModerator);

export default router;