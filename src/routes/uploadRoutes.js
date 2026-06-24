const express = require('express');
const { uploadImage } = require('../controllers/uploadController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/', protect, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, error: 'La imagen no puede superar los 5MB' });
      }
      return res.status(400).json({ success: false, error: err.message });
    }
    next();
  });
}, uploadImage);

module.exports = router;
