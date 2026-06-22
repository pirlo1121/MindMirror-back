const Post = require('../models/Post');
const slugify = require('slugify');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public (only published) or Private (all for admin/author)
exports.getPosts = async (req, res) => {
  try {
    let query = { status: 'published' };
    
    // If admin, they can see all posts
    if (req.user && req.user.role === 'admin') {
      query = {};
    }

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ publishedAt: -1, createdAt: -1 });

    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single post by slug
// @route   GET /api/posts/:slug
// @access  Public
exports.getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate('author', 'name email');

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    // Add user to req.body
    req.body.author = req.user.id;

    // Auto-generate slug from title
    let slug = slugify(req.body.title, { lower: true, strict: true });
    let counter = 1;
    let baseSlug = slug;

    while (await Post.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    req.body.slug = slug;

    const post = await Post.create(req.body);

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Make sure user is post owner or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'User not authorized to update this post' });
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Slug already exists' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all draft posts
// @route   GET /api/posts/drafts
// @access  Private (own drafts) or Admin (all drafts)
exports.getDrafts = async (req, res) => {
  try {
    let query = { status: 'draft' };

    if (req.user.role !== 'admin') {
      query.author = req.user.id;
    }

    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Publish a post (change status from draft to published)
// @route   PATCH /api/posts/:id/publish
// @access  Private (author or admin)
exports.publishPost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'User not authorized to publish this post' });
    }

    if (post.status === 'published') {
      return res.status(400).json({ success: false, error: 'Post is already published' });
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: 'published' },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Make sure user is post owner or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'User not authorized to delete this post' });
    }

    await post.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
