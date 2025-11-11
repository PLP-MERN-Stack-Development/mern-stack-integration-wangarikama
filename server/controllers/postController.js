const Post = require('../models/Post');
const mongoose = require('mongoose');
const path = require('path');
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
      .populate('author', 'username') // Populate author's username
      .populate('category', 'name')   // Populate category name
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by newest first

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

    // Check if the param is a valid Mongoose ObjectId.
    // If yes, search by ID. If not, search by slug.
    const query = mongoose.Types.ObjectId.isValid(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug };

    const post = await Post.findOne(query)
      .populate('author', 'username')
      .populate('category', 'name')
      .populate('comments.user', 'username'); // Populate username for comments

    if (!post) {
      const error = new Error('Post not found');
      error.statusCode = 404;
      return next(error);
    }

    // Optional: Increment view count
    // await post.incrementViewCount();

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
// @access  Private (for now, public)
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, category, excerpt } = req.body;
    req.body.author = req.user.id; 

    // Check for uploaded file
    if (req.file) {
      //Store the path relative to the server
      req.body.featuredImage = `/${req.file.path}`; 
    }

    if (!title || !content || !category) {const error = new Error('Post not found');
      error.statusCode = 404;
      return next(error);
    }
    
    const post = await Post.create(req.body);

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (for now, public)
exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {const error = new Error('Post not found');
      error.statusCode = 404;
      return next(error);
    }
   // Check for new file
    if (req.file) {
      req.body.featuredImage = `/${req.file.path}`;
      // TODO: Delete old image from storage
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
// @access  Private (for now, public)
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      const error = new Error('Post not found');
      error.statusCode = 404;
      return next(error);
    }

    // Add authorization check later

    await post.deleteOne(); // or post.remove() for older mongoose

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
// @access  Private (Needs auth middleware)
exports.addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      const error = new Error('Post not found');
      error.statusCode = 404;
      return next(error);
    }

    const userId = req.user.id; // From auth middleware
    const { content } = req.body;

    if (!content) {
        const error = new Error('Please provide comment content');
        error.statusCode = 400;
        return next(error);
    }
    
    // Use the custom method from your Post.js model
    const newComment = { content: content, user: userId };
    post.comments.push(newComment);
    await post.save();

    // Populate user info before sending back
    const populatedPost = await post.populate('comments.user', 'username');
    const addedComment = populatedPost.comments[populatedPost.comments.length - 1];

    res.status(201).json({
      success: true,
      data: addedComment, // Send back only the new, populated comment
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
        { title: { $regex: query, $options: 'i' } }, // 'i' for case-insensitive
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