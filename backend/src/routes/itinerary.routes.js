const express = require('express');
const router = express.Router();
const {
    generateItineraryForTrip,
    getItineraryByTripId,
    handleWhatIfScenario
} = require('../controllers/itinerary.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/generate', protect, generateItineraryForTrip);
router.get('/trip/:tripId', protect, getItineraryByTripId);
router.post('/what-if', protect, handleWhatIfScenario);

module.exports = router;
