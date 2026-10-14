const Itinerary = require('../models/itinerary.model');
const Trip = require('../models/trip.model');
const Place = require('../models/place.model');
const Restaurant = require('../models/restaurant.model');
const { generateSmartItinerary, replanWhatIf } = require('../services/ai.service');

/**
 * Generate optimized AI itinerary for a trip
 */
const generateItineraryForTrip = async (req, res) => {
    try {
        const { tripId } = req.body;
        const trip = await Trip.findById(tripId).populate('selectedPlaces.place');

        if (!trip) {
            return res.status(404).json({ success: false, message: 'Trip not found' });
        }

        // Security check
        if (trip.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized to generate itinerary for this trip' });
        }

        let placesToSequence = trip.selectedPlaces.map(sp => sp.place).filter(Boolean);

        // If traveler has not added places to tray yet, fetch top recommended places for destination
        if (placesToSequence.length === 0) {
            placesToSequence = await Place.find({
                city: new RegExp(trip.destinationCity, 'i')
            }).limit(12);
        }

        // Fetch top regional restaurants for meal integration
        const regionalRestaurants = await Restaurant.find({
            city: new RegExp(trip.destinationCity, 'i')
        }).limit(6);

        const generatedData = await generateSmartItinerary(trip, placesToSequence, regionalRestaurants);

        // Save or update existing itinerary
        let itinerary = await Itinerary.findOne({ trip: trip._id });
        if (itinerary) {
            itinerary.days = generatedData.days;
            itinerary.totalEstimatedCost = generatedData.totalEstimatedCost;
            itinerary.isWithinBudget = generatedData.isWithinBudget;
            itinerary.aiGeneratedNotes = generatedData.aiGeneratedNotes;
            await itinerary.save();
        } else {
            itinerary = await Itinerary.create({
                trip: trip._id,
                days: generatedData.days,
                totalEstimatedCost: generatedData.totalEstimatedCost,
                isWithinBudget: generatedData.isWithinBudget,
                aiGeneratedNotes: generatedData.aiGeneratedNotes
            });
        }

        // Populate place and restaurant references
        itinerary = await Itinerary.findById(itinerary._id)
            .populate('days.slots.place')
            .populate('days.slots.restaurant');

        res.status(200).json({
            success: true,
            message: 'Smart AI Itinerary generated successfully!',
            data: itinerary
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get itinerary for a trip
 */
const getItineraryByTripId = async (req, res) => {
    try {
        const { tripId } = req.params;
        const itinerary = await Itinerary.findOne({ trip: tripId })
            .populate('days.slots.place')
            .populate('days.slots.restaurant');

        if (!itinerary) {
            return res.status(404).json({ success: false, message: 'No itinerary generated yet for this trip.' });
        }

        res.status(200).json({
            success: true,
            data: itinerary
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Apply "What If" Dynamic Re-Planner
 */
const handleWhatIfScenario = async (req, res) => {
    try {
        const { tripId, scenario, params = {} } = req.body;
        // scenarios: 'EXTEND_DAY', 'BUDGET_INCREASE', 'WAKE_UP_LATE', 'RAIN_SWAP'

        const itinerary = await Itinerary.findOne({ trip: tripId });
        if (!itinerary) {
            return res.status(404).json({ success: false, message: 'Itinerary not found' });
        }

        const updatedPlan = await replanWhatIf(itinerary, scenario, params);

        itinerary.days = updatedPlan.days;
        itinerary.totalEstimatedCost = updatedPlan.totalEstimatedCost;
        itinerary.whatIfHistory = updatedPlan.whatIfHistory;
        await itinerary.save();

        const populated = await Itinerary.findById(itinerary._id)
            .populate('days.slots.place')
            .populate('days.slots.restaurant');

        res.status(200).json({
            success: true,
            message: `Applied "${scenario}" adjustment smoothly!`,
            data: populated
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    generateItineraryForTrip,
    getItineraryByTripId,
    handleWhatIfScenario
};
