const express = require('express');
const router = express.Router();
const {
    getNearbyPlaces,
    getPlaces,
    getPlaceDetails,
    createPlace,
    updatePlace,
    deletePlace
} = require('../controllers/place.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

router.get('/nearby', getNearbyPlaces);
router.get('/', getPlaces);
router.get('/:identifier', getPlaceDetails);
router.post('/', protect, authorizeRoles('ADMIN', 'MODERATOR'), createPlace);
router.put('/:id', protect, authorizeRoles('ADMIN', 'MODERATOR'), updatePlace);
router.delete('/:id', protect, authorizeRoles('ADMIN'), deletePlace);

module.exports = router;
