const express = require('express');
const router = express.Router();
const {
    getExperts,
    getExpertById,
    bookExpertTour,
    verifyBookingPayment
} = require('../controllers/expert.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', getExperts);
router.get('/:id', getExpertById);
router.post('/book', protect, bookExpertTour);
router.post('/verify-payment', protect, verifyBookingPayment);

module.exports = router;
