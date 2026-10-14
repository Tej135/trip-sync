const User = require('../models/user.model');
const LocationHistory = require('../models/locationHistory.model');
const Place = require('../models/place.model');
const { calculateDistanceMeters } = require('../services/geo.service');
const { createOrder, verifyPaymentSignature } = require('../services/payment.service');
const emailService = require('../services/email.service');

const getAllUsers = async (req, res) => {
    try {
        const { role, level } = req.query;
        const query = {};
        if (role) query.role = role.toUpperCase();
        if (level) query.explorerLevel = level.toUpperCase();

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const allowed = ['TRAVELER', 'PRO_TRAVELER', 'CREATOR', 'LOCAL_EXPERT', 'MODERATOR', 'ADMIN'];
        if (!allowed.includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role specified' });
        }

        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        res.status(200).json({
            success: true,
            message: `User role updated to ${role}`,
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Initiate or verify TripSync Pro subscription
const createProSubscriptionOrder = async (req, res) => {
    try {
        const { plan = 'monthly' } = req.body; // monthly (₹299) or annual (₹1999)
        const price = plan === 'annual' ? 1999 : 299;

        const order = await createOrder(price, `pro_${req.user._id}_${Date.now()}`, {
            plan,
            userId: req.user._id.toString()
        });

        res.status(200).json({
            success: true,
            message: 'TripSync Pro order initiated',
            data: {
                ...order,
                plan,
                price
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const verifyProSubscription = async (req, res) => {
    try {
        const { orderId, paymentId, signature, plan = 'monthly' } = req.body;
        const price = plan === 'annual' ? 1999 : 199;

        const isValid = verifyPaymentSignature(orderId, paymentId, signature);
        if (!isValid) {
            if (req.user?.email) {
                emailService.sendPaymentFailureEmail(
                    req.user.email,
                    req.user.name,
                    price,
                    `TripSync Pro (${plan})`,
                    'Payment signature verification failed'
                ).catch(err => console.error('[UserController] Failure email error:', err.message));
            }
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        const durationDays = plan === 'annual' ? 365 : 30;
        const expiryDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                role: 'PRO_TRAVELER',
                isPro: true,
                proExpiresAt: expiryDate,
                $addToSet: {
                    badges: {
                        name: 'TripSync Pro Member',
                        description: 'Unlocked unlimited AI itineraries and offline travel booklets',
                        awardedAt: new Date()
                    }
                }
            },
            { new: true }
        ).select('-password');

        // Dispatch Payment Success Email
        if (req.user?.email) {
            emailService.sendPaymentSuccessEmail(
                req.user.email,
                req.user.name,
                price,
                `TripSync Pro Subscription (${plan})`,
                paymentId
            ).catch(err => console.error('[UserController] Success email error:', err.message));
        }

        res.status(200).json({
            success: true,
            message: 'TripSync Pro activated successfully!',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Dwell GPS Logging for Tier 1 Proof-of-Travel
const recordLocationDwell = async (req, res) => {
    try {
        const { longitude, latitude, accuracy = 10, dwellMinutes = 20 } = req.body;

        if (longitude === undefined || latitude === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Longitude and latitude are required'
            });
        }

        const lng = parseFloat(longitude);
        const lat = parseFloat(latitude);

        // Find closest place within 250 meters
        const nearestPlaces = await Place.find({
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [lng, lat] },
                    $maxDistance: 250
                }
            }
        }).limit(1);

        const nearestPlace = nearestPlaces.length > 0 ? nearestPlaces[0] : null;
        let distanceMeters = 0;
        if (nearestPlace) {
            distanceMeters = calculateDistanceMeters(
                lat, lng,
                nearestPlace.location.coordinates[1],
                nearestPlace.location.coordinates[0]
            );
        }

        const record = await LocationHistory.create({
            user: req.user._id,
            location: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            accuracy,
            dwellStart: new Date(Date.now() - dwellMinutes * 60 * 1000),
            dwellEnd: new Date(),
            dwellMinutes,
            nearestPlace: nearestPlace ? nearestPlace._id : undefined,
            distanceMeters
        });

        res.status(201).json({
            success: true,
            message: nearestPlace 
                ? `GPS Dwell check-in confirmed at ${nearestPlace.name} (${dwellMinutes}m dwell)`
                : `GPS Location point recorded (${dwellMinutes}m dwell)`,
            data: {
                record,
                nearestPlaceName: nearestPlace?.name,
                isWithinVerifiedRadius: distanceMeters <= 250
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getUserLocationHistory = async (req, res) => {
    try {
        const history = await LocationHistory.find({ user: req.user._id })
            .populate('nearestPlace', 'name slug category city')
            .sort({ createdAt: -1 })
            .limit(30);

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUserRole,
    createProSubscriptionOrder,
    verifyProSubscription,
    recordLocationDwell,
    getUserLocationHistory
};
