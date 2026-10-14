const Trip = require('../models/trip.model');
const Itinerary = require('../models/itinerary.model');
const User = require('../models/user.model');
const Place = require('../models/place.model');

/**
 * Calculate automated budget partitions
 */
const partitionBudget = (totalBudget) => {
    return {
        transit: Math.round(totalBudget * 0.30),
        accommodation: Math.round(totalBudget * 0.35),
        food: Math.round(totalBudget * 0.20),
        tickets: Math.round(totalBudget * 0.10),
        emergencyBuffer: Math.round(totalBudget * 0.05)
    };
};

/**
 * Create a new Trip
 */
const createTrip = async (req, res) => {
    try {
        const {
            title,
            originCity,
            destinationCity,
            destinationState,
            startDate,
            endDate,
            totalBudget,
            travelPersonality,
            dailyActiveWindow
        } = req.body;

        if (!title || !originCity || !destinationCity || !startDate || !endDate || !totalBudget) {
            return res.status(400).json({
                success: false,
                message: 'Title, origin, destination, dates, and total budget are required'
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

        const budgetAllocations = partitionBudget(parseFloat(totalBudget));

        const trip = await Trip.create({
            title,
            owner: req.user._id,
            originCity,
            destinationCity,
            destinationState: destinationState || '',
            startDate: start,
            endDate: end,
            totalDays,
            totalBudget: parseFloat(totalBudget),
            travelPersonality: travelPersonality || req.user.personalityArchetype || 'EXPLORER',
            dailyActiveWindow: dailyActiveWindow || { startTime: '09:00 AM', endTime: '06:00 PM' },
            budgetAllocations
        });

        res.status(201).json({
            success: true,
            message: 'Trip created successfully',
            data: trip
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get all trips for the authenticated user
 */
const getMyTrips = async (req, res) => {
    try {
        const trips = await Trip.find({
            $or: [
                { owner: req.user._id },
                { 'collaborators.user': req.user._id }
            ]
        })
        .populate('selectedPlaces.place', 'name category photoUrls averageRating safetyScore')
        .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            count: trips.length,
            data: trips
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get single trip by ID (with ownership/collaborator check)
 */
const getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id)
            .populate('owner', 'name email avatar explorerLevel')
            .populate('selectedPlaces.place')
            .populate('collaborators.user', 'name email avatar');

        if (!trip) {
            return res.status(404).json({ success: false, message: 'Trip not found' });
        }

        // Security Check: Unauthorized users cannot view private trips
        const isOwner = trip.owner._id.toString() === req.user._id.toString();
        const isCollaborator = trip.collaborators.some(c => c.user._id.toString() === req.user._id.toString());
        const isAdmin = req.user.role === 'ADMIN';

        if (!isOwner && !isCollaborator && !isAdmin && !trip.isPublic) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: You do not have permission to view this trip.'
            });
        }

        res.status(200).json({
            success: true,
            data: trip
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Add place to Trip Tray
 */
const addPlaceToTrip = async (req, res) => {
    try {
        const { placeId } = req.body;
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ success: false, message: 'Trip not found' });
        }

        if (trip.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized: Only trip owner can modify places' });
        }

        const place = await Place.findById(placeId);
        if (!place) {
            return res.status(404).json({ success: false, message: 'Place not found' });
        }

        const alreadyAdded = trip.selectedPlaces.some(p => p.place.toString() === placeId.toString());
        if (!alreadyAdded) {
            trip.selectedPlaces.push({
                place: place._id,
                priority: trip.selectedPlaces.length + 1
            });
            await trip.save();
        }

        res.status(200).json({
            success: true,
            message: `${place.name} added to trip tray`,
            data: trip
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Remove place from Trip Tray
 */
const removePlaceFromTrip = async (req, res) => {
    try {
        const { placeId } = req.params;
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ success: false, message: 'Trip not found' });
        }

        if (trip.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized: Only trip owner can modify places' });
        }

        trip.selectedPlaces = trip.selectedPlaces.filter(p => p.place.toString() !== placeId.toString());
        await trip.save();

        res.status(200).json({
            success: true,
            message: 'Place removed from trip',
            data: trip
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Add collaborator to trip
 */
const addCollaborator = async (req, res) => {
    try {
        const { email, role = 'EDITOR' } = req.body;
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ success: false, message: 'Trip not found' });
        }

        if (trip.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Only the trip owner can add collaborators' });
        }

        const friend = await User.findOne({ email: email.toLowerCase() });
        if (!friend) {
            return res.status(404).json({ success: false, message: 'User with this email not found on TripSync' });
        }

        const alreadyCollab = trip.collaborators.some(c => c.user.toString() === friend._id.toString());
        if (!alreadyCollab) {
            trip.collaborators.push({ user: friend._id, role });
            await trip.save();
        }

        res.status(200).json({
            success: true,
            message: `${friend.name} added as trip collaborator`,
            data: trip
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createTrip,
    getMyTrips,
    getTripById,
    addPlaceToTrip,
    removePlaceFromTrip,
    addCollaborator
};
