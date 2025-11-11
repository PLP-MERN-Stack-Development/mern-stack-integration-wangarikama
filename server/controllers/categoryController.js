const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 }); // Sort alphabetically
    res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
        });
    } catch (err) {
    next(err);
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Protected (to be implemented with auth later)
exports.createCategory = async (req, res, next) => {
  try {
    if (!req.body.name) {
      const error = new Error('Please provide a category name');
      error.statusCode = 400;
      return next(error);
    }

    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error('Category already exists');
      error.statusCode = 400;
      return next(error);
    }
    next(err);
  }
};
