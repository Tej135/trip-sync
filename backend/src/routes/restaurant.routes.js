const express = require('express');
const router = express.Router();
const {
    getRestaurants,
    getRestaurantById,
    createRestaurant
} = require('../controllers/restaurant.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', protect, authorizeRoles('ADMIN'), createRestaurant);

module.exports = router;
