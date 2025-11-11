const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController'); 
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', postController.getAllPosts);
router.get('/search', postController.searchPosts);
router.get('/:id', postController.getPostById);
router.post('/:id/comments', protect, postController.addComment); 

// Protected routes
router.post('/', protect, upload.single('featuredImage'), postController.createPost);
router.put('/:id', protect, upload.single('featuredImage'), postController.updatePost);
router.delete('/:id', protect, postController.deletePost);

module.exports = router;