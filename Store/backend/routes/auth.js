import express from 'express';
import { 
  register, 
  login, 
  updatePassword, 
  getProfile 
} from '../controllers/authController.js';
import { 
  validateUserRegistration, 
  validateUserLogin, 
  validatePasswordUpdate 
} from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/password', authenticateToken, validatePasswordUpdate, updatePassword);

export default router;



