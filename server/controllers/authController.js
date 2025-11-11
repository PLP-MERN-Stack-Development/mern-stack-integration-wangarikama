const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to sign a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      const error = new Error('Email or username already exists');
      error.statusCode = 400;
      return next(error);
    }

    // 2. Create new user (password will be hashed by the 'pre' hook in model)
    const user = await User.create({
      username,
      email,
      password,
    });

    // 3. Create token
    const token = generateToken(user._id);

    // 4. Send response (omitting password)
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Check for email and password
    if (!email || !password) {
      const error = new Error('Please provide email and password');
      error.statusCode = 400;
      return next(error);
    }

    // 2. Find user by email (and explicitly select the password)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401; // Unauthorized
      return next(error);
    }

    // 3. Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401; // Unauthorized
      return next(error);
    }

    // 4. Create token
    const token = generateToken(user._id);

    // 5. Send response
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};