const express = require('express');
const router = express.Router();
const {
    createReview,
    getPlaceReviews,
    upvoteReview
} = require('../controllers/review.controller');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.post('/', protect, upload.single('photoProof'), createReview);
router.get('/place/:placeId', getPlaceReviews);
router.post('/:id/upvote', protect, upvoteReview);

module.exports = router;
