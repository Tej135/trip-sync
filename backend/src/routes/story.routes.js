const express = require('express');
const router = express.Router();
const {
    createStory,
    getStories,
    toggleLikeStory
} = require('../controllers/story.controller');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/', getStories);
router.post('/', protect, upload.single('mediaFile'), createStory);
router.post('/:id/like', protect, toggleLikeStory);

module.exports = router;
