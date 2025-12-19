import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

export const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required'),
  
  handleValidationErrors
];

export const validateLogin = [
  body('identifier')
    .trim()
    .notEmpty()
    .withMessage('Username or email is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

export const validateBlogPost = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must not exceed 200 characters'),
  
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Content is required'),
  
  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL'),
  
  handleValidationErrors
];

export const validateForumThread = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must not exceed 200 characters'),
  
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Content is required'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category must not exceed 50 characters'),
  
  handleValidationErrors
];

export const validateComment = [
  body('text')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment text is required and must not exceed 1000 characters'),
  
  handleValidationErrors
];

export const validateReply = [
  body('text')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Reply text is required and must not exceed 2000 characters'),
  
  handleValidationErrors
];