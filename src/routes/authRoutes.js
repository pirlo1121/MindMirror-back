const express = require('express');
const { register, login, logout, getProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { validateRegister, validateLogin, handleValidationErrors } = require('../middlewares/validateMiddleware');

const router = express.Router();

router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);

module.exports = router;
