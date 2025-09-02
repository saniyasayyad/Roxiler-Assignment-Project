import express from 'express';
import {
  getStoresForUser,
  submitRating,
  getUserRatings,
  createStore,
} from '../controllers/storeController.js';
import { validateRating } from '../middleware/validation.js';
import {
  authenticateToken,
  requireNormalUserOrAdmin,
  requireRole,
} from '../middleware/auth.js';

const router = express.Router();

// Require authentication for all store routes
router.use(authenticateToken);

// List stores (visible to Normal User or Admin)
router.get('/', requireNormalUserOrAdmin, getStoresForUser);

// Submit or update a rating for a store (validated input)
router.post('/ratings', requireNormalUserOrAdmin, validateRating, submitRating);

// Get current user's ratings history
router.get('/ratings', requireNormalUserOrAdmin, getUserRatings);

// Create a new store (Store Owner or Admin only)
router.post('/', requireRole(['Store Owner', 'System Administrator']), createStore);

export default router;


