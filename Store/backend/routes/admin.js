import express from 'express';
import { 
  getDashboardStats,
  getUsers,
  getUserById,
  addUser,
  getStores,
  getStoreById,
  addStore
} from '../controllers/adminController.js';
import { 
  validateAddUser, 
  validateAddStore 
} from '../middleware/validation.js';
import { 
  authenticateToken, 
  requireAdmin 
} from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// User management
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', validateAddUser, addUser);

// Store management
router.get('/stores', getStores);
router.get('/stores/:id', getStoreById);
router.post('/stores', validateAddStore, addStore);

export default router;



