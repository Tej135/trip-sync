const express = require('express');
const router = express.Router();
const {
    createTrip,
    getMyTrips,
    getTripById,
    addPlaceToTrip,
    removePlaceFromTrip,
    addCollaborator
} = require('../controllers/trip.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/', protect, createTrip);
router.get('/', protect, getMyTrips);
router.get('/:id', protect, getTripById);
router.post('/:id/places', protect, addPlaceToTrip);
router.delete('/:id/places/:placeId', protect, removePlaceFromTrip);
router.post('/:id/collaborators', protect, addCollaborator);

module.exports = router;
