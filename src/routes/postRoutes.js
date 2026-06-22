const express = require('express');
const {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Optional protect middleware for GET posts allows admin to see drafts.
// But we can just make it public and check req.cookies manually if we want,
// For simplicity, we define public routes explicitly.

// Public routes
router.get('/', getPosts); // We'll modify this later if we want the token read without erroring out
router.get('/:slug', getPostBySlug);

// Private routes
router.use(protect); // All routes below this will require authentication
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
