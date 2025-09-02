import { body, validationResult } from 'express-validator';

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

// Validation rules for user registration
export const validateUserRegistration = [
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage('Password must contain at least one uppercase letter and one special character'),
  
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters')
    .notEmpty()
    .withMessage('Address is required'),
  
  handleValidationErrors
];

// Validation rules for user login
export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Validation rules for password update
export const validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('New password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage('New password must contain at least one uppercase letter and one special character'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Validation rules for adding user (admin only)
export const validateAddUser = [
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
    .withMessage('Password must contain at least one uppercase letter and one special character'),
  
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters')
    .notEmpty()
    .withMessage('Address is required'),
  
  body('role')
    .isIn(['System Administrator', 'Normal User', 'Store Owner'])
    .withMessage('Invalid role selected'),
  
  handleValidationErrors
];

// Validation rules for adding store (admin only)
export const validateAddStore = [
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Store name must be between 20 and 60 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters')
    .notEmpty()
    .withMessage('Address is required'),
  
  handleValidationErrors
];

// Validation rules for rating submission
export const validateRating = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('storeId')
    .isInt({ min: 1 })
    .withMessage('Valid store ID is required'),
  
  handleValidationErrors
];

// Validation rules for search/filter parameters
export const validateSearchParams = [
  body('searchTerm')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Search term must not exceed 100 characters'),
  
  body('filterBy')
    .optional()
    .isIn(['name', 'email', 'address', 'role'])
    .withMessage('Invalid filter field'),
  
  handleValidationErrors
];

