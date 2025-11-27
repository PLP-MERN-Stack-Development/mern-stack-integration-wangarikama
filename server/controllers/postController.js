const Post = require('../models/Post');
const mongoose = require('mongoose');
const path = require('path');

const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
};

// @desc    Get all posts with pagination and optional category filter
// @route   GET /api/posts
// @access  Public
exports.getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;

    const query = {};
    if (category) {
      query.category = category;
    }

    const posts = await Post.find(query)
      .populate('author', 'username')
      .populate('category', 'name')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: posts,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single post (by ID or Slug)
// @route   GET /api/posts/:id
// @access  Public
exports.getPostById = async (req, res, next) => {
  try {
    const idOrSlug = req.params.id;

    const query = mongoose.Types.ObjectId.isValid(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug };

    const post = await Post.findOne(query)
      .populate('author', 'username')
      .populate('category', 'name')
      .populate('comments.user', 'username');

    if (!post) {
      const error = new Error('Post not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, category, excerpt } = req.body;
    req.body.author = req.user.id; 

    // Check for uploaded file
    if (req.file) {
      req.body.featuredImage = `/${req.file.path}`; 
    }

    // Validation
    if (!title || !content || !category) {
      const error = new Error('Please provide title, content and category'); // Fixed error message
      error.statusCode = 400; // Fixed status code (was 404)
      return next(error);
    }
    
    // 2. INSERT SLUG GENERATION HERE <--- NEW
    if (!req.body.slug && title) {
      req.body.slug = generateSlug(title);
    }

    const post = await Post.create(req.body);

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (err) {
    // If slug is duplicate, handle error gracefully
    if (err.code === 11000 && err.keyPattern.slug) {
       const error = new Error('A post with this title already exists');
       error.statusCode = 400;
       return next(error);
    }
    next(err);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      const error = new Error('Post not found');
      error.statusCode = 404;
      return next(error);
    }

    if (req.file) {
      req.body.featuredImage = `/${req.file.path}`;
    }

    // 3. Update slug if title changes (Optional but recommended) <--- NEW
    if (req.body.title && !req.body.slug) {
        req.body.slug = generateSlug(req.body.title);
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      const error = new Error('Post not found');
      error.statusCode = 404;
      return next(error);
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add a comment
// @route   POST /api/posts/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      const error = new Error('Post not found');
      error.statusCode = 404;
      return next(error);
    }

    const userId = req.user.id;
    const { content } = req.body;

    if (!content) {
        const error = new Error('Please provide comment content');
        error.statusCode = 400;
        return next(error);
    }
    
    const newComment = { content: content, user: userId };
    post.comments.push(newComment);
    await post.save();

    const populatedPost = await post.populate('comments.user', 'username');
    const addedComment = populatedPost.comments[populatedPost.comments.length - 1];

    res.status(201).json({
      success: true,
      data: addedComment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search posts
// @route   GET /api/posts/search
// @access  Public
exports.searchPosts = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query) {
      const error = new Error('Please provide a search query');
      error.statusCode = 400;
      return next(error);
    }

    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
      ],
    })
      .populate('author', 'username')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (err) {
    next(err);
  }
};