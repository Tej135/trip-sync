const express = require('express');
const router = express.Router();
const { createPaymentOrder, verifyPayment, getPaymentConfig } = require('../controllers/payment.controller');
const { protect, optionalProtect } = require('../middlewares/auth.middleware');

// Public route to get Razorpay public key
router.get('/config', getPaymentConfig);

// Create order (protected)
router.post('/create-order', protect, createPaymentOrder);

// Verify payment signature and trigger success/failure email (protected)
router.post('/verify', protect, verifyPayment);

module.exports = router;
