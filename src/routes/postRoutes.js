const express = require('express');
const {
  getPosts,
  getPostBySlug,
  getDrafts,
  createPost,
  updatePost,
  deletePost,
  publishPost
} = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Optional protect middleware for GET posts allows admin to see drafts.
// But we can just make it public and check req.cookies manually if we want,
// For simplicity, we define public routes explicitly.

// Public routes
router.get('/', getPosts);
router.get('/drafts', protect, getDrafts);
router.get('/:slug', getPostBySlug);

// Private routes
router.use(protect); // All routes below this will require authentication
router.post('/', createPost);
router.put('/:id', updatePost);
router.patch('/:id/publish', publishPost);
router.delete('/:id', deletePost);

module.exports = router;
