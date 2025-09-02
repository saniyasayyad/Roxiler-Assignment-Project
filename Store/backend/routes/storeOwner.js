import express from 'express';
import { 
  getStoreOwnerDashboard,
  getStoreRatings,
  getStoreRaters
} from '../controllers/storeOwnerController.js';
import { 
  authenticateToken, 
  requireStoreOwner 
} from '../middleware/auth.js';

const router = express.Router();

// All store owner routes require authentication and store owner role
router.use(authenticateToken, requireStoreOwner);

// Dashboard
router.get('/dashboard', getStoreOwnerDashboard);

// Store ratings
router.get('/stores/:storeId/ratings', getStoreRatings);

// Users who rated stores
router.get('/raters', getStoreRaters);

export default router;



