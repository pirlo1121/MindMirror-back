const { check, validationResult } = require('express-validator');

// Validation rules for registering a user
const validateRegister = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .escape(),
  check('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please include a valid email')
    .normalizeEmail(),
  check('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .escape()
];

// Validation rules for login
const validateLogin = [
  check('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please include a valid email')
    .normalizeEmail(),
  check('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .escape()
];

// Middleware to check validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return 400 Bad Request if validation fails
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  handleValidationErrors
};
