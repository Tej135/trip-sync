const Trip = require('../models/trip.model');
const Itinerary = require('../models/itinerary.model');
const EmergencyContact = require('../models/emergencyContact.model');
const { generateTravelBooklet } = require('../services/pdf.service');
const path = require('path');
const fs = require('fs');

/**
 * Generate and download offline travel booklet PDF
 */
const downloadOfflineBooklet = async (req, res) => {
    try {
        const { tripId } = req.params;

        const trip = await Trip.findById(tripId).populate('owner', 'name email');
        if (!trip) {
            return res.status(404).json({ success: false, message: 'Trip not found' });
        }

        const itinerary = await Itinerary.findOne({ trip: tripId })
            .populate('days.slots.place')
            .populate('days.slots.restaurant');

        const contacts = await EmergencyContact.find({ user: req.user._id });

        const relativePdfPath = await generateTravelBooklet(trip, itinerary, contacts);

        // Update trip record
        trip.offlineBookletPath = relativePdfPath;
        await trip.save();

        const fullFilePath = path.join(__dirname, '../../', relativePdfPath);

        res.download(fullFilePath, `TripSync_${trip.destinationCity}_Travel_Guide.pdf`, (err) => {
            if (err) {
                console.error('[BookletController] Download error:', err);
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    downloadOfflineBooklet
};
