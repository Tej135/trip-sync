const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    updateUserRole,
    createProSubscriptionOrder,
    verifyProSubscription,
    recordLocationDwell,
    getUserLocationHistory
} = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

router.get('/', protect, authorizeRoles('ADMIN', 'MODERATOR'), getAllUsers);
router.get('/history/location', protect, getUserLocationHistory);
router.post('/location/dwell', protect, recordLocationDwell);
router.post('/pro/order', protect, createProSubscriptionOrder);
router.post('/pro/verify', protect, verifyProSubscription);
router.get('/:id', getUserById);
router.patch('/:id/role', protect, authorizeRoles('ADMIN'), updateUserRole);

module.exports = router;
