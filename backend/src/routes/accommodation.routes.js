const express = require('express');
const router = express.Router();
const {
    getAccommodations,
    getAccommodationById,
    createAccommodation
} = require('../controllers/accommodation.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

router.get('/', getAccommodations);
router.get('/:id', getAccommodationById);
router.post('/', protect, authorizeRoles('ADMIN'), createAccommodation);

module.exports = router;
